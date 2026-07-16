import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, JournalEntry, JournalLine])],
  exports: [TypeOrmModule],
})
export class FinancialLedgerModule {}
