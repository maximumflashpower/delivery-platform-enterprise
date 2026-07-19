import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FinancialLedgerService } from '../services/financial-ledger.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AccountType } from '../enums/account-type.enum';
import { AccountCurrency } from '../enums/account-currency.enum';
import { JournalEntryType } from '../enums/journal-entry-type.enum';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';

@ApiTags('financial-ledger')
@Controller('financial-ledger')
export class FinancialLedgerController {
  constructor(private readonly service: FinancialLedgerService) {}

  // ========== ACCOUNTS ==========
  @Post('accounts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  createAccount(@Body() dto: {
    accountNumber: string;
    name: string;
    type: AccountType;
    currency?: AccountCurrency;
    description?: string;
  }) {
    return this.service.createAccount(dto);
  }

  @Get('accounts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all active accounts' })
  @ApiResponse({ status: 200, description: 'Return list of accounts' })
  findAllAccounts(@Query('type') type?: AccountType) {
    return this.service.findAllAccounts(type ? { type } : undefined);
  }

  @Get('accounts/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Return account details' })
  findAccountById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findAccountById(id);
  }

  @Get('accounts/number/:accountNumber')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get account by account number' })
  @ApiResponse({ status: 200, description: 'Return account details' })
  findAccountByNumber(@Param('accountNumber') accountNumber: string) {
    return this.service.findAccountByNumber(accountNumber);
  }

  @Put('accounts/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  updateAccount(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<any>) {
    return this.service.updateAccount(id, data);
  }

  @Delete('accounts/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Deactivate account (soft delete)' })
  @ApiResponse({ status: 200, description: 'Account deactivated' })
  deactivateAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deactivateAccount(id);
  }

  // ========== JOURNAL ENTRIES ==========
  @Post('entries')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create journal entry' })
  @ApiResponse({ status: 201, description: 'Entry created successfully' })
  createJournalEntry(@Body() dto: {
    entryNumber: string;
    entryDate: Date;
    description: string;
    reference?: string;
  }) {
    return this.service.createJournalEntry(dto);
  }

  @Get('entries')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all journal entries' })
  @ApiResponse({ status: 200, description: 'Return list of entries' })
  findAllJournalEntries(@Query('status') status?: string) {
    return this.service.findAllJournalEntries(status ? { status } : undefined);
  }

  @Get('entries/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get journal entry by ID' })
  @ApiResponse({ status: 200, description: 'Return entry details' })
  findJournalEntryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findJournalEntryById(id);
  }

  @Post('entries/:id/post')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Validate and post journal entry (double-entry validation)' })
  @ApiResponse({ status: 200, description: 'Entry posted successfully' })
  postJournalEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.validateAndPostEntry(id);
  }

  @Post('entries/:id/void')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Void a posted journal entry' })
  @ApiResponse({ status: 200, description: 'Entry voided' })
  voidJournalEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.voidJournalEntry(id);
  }

  // ========== JOURNAL LINES ==========
  @Post('entries/:entryId/lines')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add journal line to entry' })
  @ApiResponse({ status: 201, description: 'Line added successfully' })
  addJournalLine(@Param('entryId', ParseUUIDPipe) entryId: string, @Body() dto: {
    accountId: string;
    type: JournalEntryType;
    amount: number;
    description?: string;
    reference?: string;
  }) {
    return this.service.addJournalLine(entryId, dto);
  }

  // ========== BALANCE REPORTS ==========
  @Get('accounts/:id/balance')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get account balance with debits/credits breakdown' })
  @ApiResponse({ status: 200, description: 'Return balance details' })
  getAccountBalance(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getAccountBalance(id);
  }

  @Get('reports/trial-balance')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get trial balance (all accounts debits/credits)' })
  @ApiResponse({ status: 200, description: 'Return trial balance' })
  getTrialBalance() {
    return this.service.getTrialBalance();
  }

  @Get('reports/general-ledger')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get general ledger report for date range' })
  @ApiResponse({ status: 200, description: 'Return general ledger' })
  getGeneralLedgerReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.getGeneralLedgerReport(new Date(startDate), new Date(endDate));
  }
}
