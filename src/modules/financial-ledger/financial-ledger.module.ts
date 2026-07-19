import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { FinancialLedgerService } from './services/financial-ledger.service';
import { FinancialLedgerController } from './controllers/financial-ledger.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, JournalEntry, JournalLine])],
  controllers: [FinancialLedgerController],
  providers: [FinancialLedgerService],
  exports: [TypeOrmModule, FinancialLedgerService],
})
export class FinancialLedgerModule {}
