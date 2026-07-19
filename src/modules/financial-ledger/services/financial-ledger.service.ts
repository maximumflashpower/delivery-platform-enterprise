import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Account } from '../entities/account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalLine } from '../entities/journal-line.entity';
import { AccountType } from '../enums/account-type.enum';
import { AccountCurrency } from '../enums/account-currency.enum';
import { JournalEntryType } from '../enums/journal-entry-type.enum';

@Injectable()
export class FinancialLedgerService {
  private readonly logger = new Logger(FinancialLedgerService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepo: Repository<JournalEntry>,
    @InjectRepository(JournalLine)
    private readonly journalLineRepo: Repository<JournalLine>,
  ) {}

  // ========== ACCOUNTS ==========
  async createAccount(data: {
    accountNumber: string;
    name: string;
    type: AccountType;
    currency?: AccountCurrency;
    description?: string;
  }): Promise<Account> {
    const account = this.accountRepo.create({
      ...data,
      currency: data.currency || AccountCurrency.MXN,
      balance: 0,
      status: 'active',
    });
    return this.accountRepo.save(account);
  }

  async findAllAccounts(where?: Partial<Account>): Promise<Account[]> {
    return this.accountRepo.find({
      where: where || { status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  async findAccountById(id: string): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async findAccountByNumber(accountNumber: string): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { accountNumber } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    const account = await this.findAccountById(id);
    Object.assign(account, data);
    return this.accountRepo.save(account);
  }

  async deactivateAccount(id: string): Promise<void> {
    const account = await this.findAccountById(id);
    account.status = 'inactive';
    await this.accountRepo.save(account);
  }

  // ========== JOURNAL ENTRIES ==========
  async createJournalEntry(data: {
    entryNumber: string;
    entryDate: Date;
    description: string;
    reference?: string;
  }): Promise<JournalEntry> {
    const entry = this.journalEntryRepo.create({
      ...data,
      status: 'draft',
    });
    return this.journalEntryRepo.save(entry);
  }

  async findAllJournalEntries(where?: Partial<JournalEntry>): Promise<JournalEntry[]> {
    return this.journalEntryRepo.find({
      where: where || {},
      relations: {'lines'},
      order: { createdAt: 'DESC' },
    });
  }

  async findJournalEntryById(id: string): Promise<JournalEntry> {
    const entry = await this.journalEntryRepo.findOne({
      where: { id },
      relations: {'lines'},
    });
    if (!entry) throw new NotFoundException('Journal entry not found');
    return entry;
  }

  async updateJournalEntryStatus(entryId: string, status: string): Promise<JournalEntry> {
    const entry = await this.findJournalEntryById(entryId);
    entry.status = status;
    return this.journalEntryRepo.save(entry);
  }

  // ========== JOURNAL LINES (DOUBLE ENTRY) ==========
  async addJournalLine(entryId: string, lineData: {
    accountId: string;
    type: JournalEntryType;
    amount: number;
    description?: string;
    reference?: string;
  }): Promise<JournalLine> {
    const entry = await this.findJournalEntryById(entryId);
    
    if (entry.status === 'posted') {
      throw new BadRequestException('Cannot modify posted journal entry');
    }

    const line = this.journalLineRepo.create({
      ...lineData,
      entryId,
    });
    return this.journalLineRepo.save(line);
  }

  async validateAndPostEntry(entryId: string): Promise<JournalEntry> {
    const entry = await this.findJournalEntryById(entryId);

    if (entry.status === 'posted') {
      throw new BadRequestException('Entry already posted');
    }

    const lines = await this.journalLineRepo.find({
      where: { entryId },
    });

    if (lines.length === 0) {
      throw new BadRequestException('Journal entry has no lines');
    }

    let debitTotal = 0;
    let creditTotal = 0;

    for (const line of lines) {
      if (line.type === JournalEntryType.DEBIT) {
        debitTotal += line.amount;
      } else if (line.type === JournalEntryType.CREDIT) {
        creditTotal += line.amount;
      }
    }

    if (Math.abs(debitTotal - creditTotal) > 0.0001) {
      throw new BadRequestException(`Debits (${debitTotal}) must equal credits (${creditTotal})`);
    }

    entry.status = 'posted';
    await this.journalEntryRepo.save(entry);

    for (const line of lines) {
      const account = await this.findAccountById(line.accountId);
      
      if (line.type === JournalEntryType.DEBIT) {
        if ([AccountType.ASSET, AccountType.EXPENSE].includes(account.type)) {
          account.balance += line.amount;
        } else {
          account.balance -= line.amount;
        }
      } else if (line.type === JournalEntryType.CREDIT) {
        if ([AccountType.ASSET, AccountType.EXPENSE].includes(account.type)) {
          account.balance -= line.amount;
        } else {
          account.balance += line.amount;
        }
      }
      
      await this.accountRepo.save(account);
    }

    this.logger.log(`Journal entry ${entryId} posted successfully`);
    return entry;
  }

  async voidJournalEntry(entryId: string): Promise<JournalEntry> {
    const entry = await this.findJournalEntryById(entryId);
    if (entry.status !== 'posted') {
      throw new BadRequestException('Only posted entries can be voided');
    }
    entry.status = 'voided';
    return this.journalEntryRepo.save(entry);
  }

  // ========== BALANCE QUERIES ==========
  async getAccountBalance(accountId: string): Promise<{
    account: Account;
    totalDebits: number;
    totalCredits: number;
    netBalance: number;
  }> {
    const account = await this.findAccountById(accountId);
    const lines = await this.journalLineRepo.find({ where: { accountId } });

    let totalDebits = 0;
    let totalCredits = 0;

    for (const line of lines) {
      if (line.type === JournalEntryType.DEBIT) totalDebits += line.amount;
      else if (line.type === JournalEntryType.CREDIT) totalCredits += line.amount;
    }

    return { account, totalDebits, totalCredits, netBalance: totalDebits - totalCredits };
  }

  async getTrialBalance(): Promise<{
    accounts: Array<{
      accountId: string;
      accountNumber: string;
      name: string;
      type: AccountType;
      debit: number;
      credit: number;
      balance: number;
    }>;
    totalDebits: number;
    totalCredits: number;
  }> {
    const accounts = await this.accountRepo.find({ where: { status: 'active' } });
    const result: Array<{
      accountId: string;
      accountNumber: string;
      name: string;
      type: AccountType;
      debit: number;
      credit: number;
      balance: number;
    }> = [];
    let totalDebits = 0;
    let totalCredits = 0;

    for (const account of accounts) {
      const lines = await this.journalLineRepo.find({ where: { accountId: account.id } });
      let debit = 0;
      let credit = 0;

      for (const line of lines) {
        if (line.type === JournalEntryType.DEBIT) debit += line.amount;
        else if (line.type === JournalEntryType.CREDIT) credit += line.amount;
      }

      totalDebits += debit;
      totalCredits += credit;

      result.push({
        accountId: account.id,
        accountNumber: account.accountNumber,
        name: account.name,
        type: account.type,
        debit,
        credit,
        balance: debit - credit,
      });
    }

    return { accounts: result, totalDebits, totalCredits };
  }

  async getGeneralLedgerReport(startDate: Date, endDate: Date): Promise<Array<{
    entry: JournalEntry;
    lines: JournalLine[];
    accountBalances: Record<string, number>;
  }>> {
    const entries = await this.journalEntryRepo.find({
      where: { entryDate: Between(startDate, endDate), status: 'posted' },
      relations: {'lines'},
      order: { entryDate: 'ASC' },
    });

    const report: Array<{
      entry: JournalEntry;
      lines: JournalLine[];
      accountBalances: Record<string, number>;
    }> = [];
    
    for (const entry of entries) {
      const accountBalances: Record<string, number> = {};
      for (const line of entry.lines) {
        accountBalances[line.accountId] = (accountBalances[line.accountId] || 0) + line.amount;
      }
      report.push({ entry, lines: entry.lines, accountBalances });
    }

    return report;
  }
}
