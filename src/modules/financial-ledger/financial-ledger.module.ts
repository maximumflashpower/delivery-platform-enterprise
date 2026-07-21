import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { RevenueSnapshot } from './entities/revenue-snapshot.entity';
import { FinancialLedgerService } from './services/financial-ledger.service';
import { RevenueDashboardService } from './services/revenue-dashboard.service';
import { FinancialLedgerController } from './controllers/financial-ledger.controller';
import { RevenueDashboardController } from './controllers/revenue-dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, JournalEntry, JournalLine, RevenueSnapshot])],
  controllers: [FinancialLedgerController, RevenueDashboardController],
  providers: [FinancialLedgerService, RevenueDashboardService],
  exports: [TypeOrmModule, FinancialLedgerService, RevenueDashboardService],
})
export class FinancialLedgerModule {}
