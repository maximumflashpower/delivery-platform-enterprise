import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { RevenueSnapshot } from './entities/revenue-snapshot.entity';
import { MilestoneEscrow } from './entities/milestone-escrow.entity';
import { FinancialLedgerService } from './services/financial-ledger.service';
import { RevenueDashboardService } from './services/revenue-dashboard.service';
import { MilestoneEscrowService } from './services/milestone-escrow.service';
import { FinancialLedgerController } from './controllers/financial-ledger.controller';
import { RevenueDashboardController } from './controllers/revenue-dashboard.controller';
import { MilestoneEscrowController } from './controllers/milestone-escrow.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Account,
    JournalEntry,
    JournalLine,
    RevenueSnapshot,
    MilestoneEscrow,
  ])],
  controllers: [FinancialLedgerController, RevenueDashboardController, MilestoneEscrowController],
  providers: [FinancialLedgerService, RevenueDashboardService, MilestoneEscrowService],
  exports: [TypeOrmModule, MilestoneEscrowService],
})
export class FinancialLedgerModule {}
