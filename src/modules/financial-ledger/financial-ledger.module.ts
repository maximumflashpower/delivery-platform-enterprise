import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { RevenueSnapshot } from './entities/revenue-snapshot.entity';
import { MilestoneEscrow } from './entities/milestone-escrow.entity';
import { SponsorInvoice } from './entities/sponsor-invoice.entity';
import { SponsorComplianceRecord } from './entities/sponsor-compliance-record.entity';
import { FinancialLedgerService } from './services/financial-ledger.service';
import { RevenueDashboardService } from './services/revenue-dashboard.service';
import { MilestoneEscrowService } from './services/milestone-escrow.service';
import { SponsorInvoiceService } from './services/sponsor-invoice.service';
import { SponsorComplianceService } from './services/sponsor-compliance.service';
import { FinancialLedgerController } from './controllers/financial-ledger.controller';
import { RevenueDashboardController } from './controllers/revenue-dashboard.controller';
import { MilestoneEscrowController } from './controllers/milestone-escrow.controller';
import { SponsorInvoiceController } from './controllers/sponsor-invoice.controller';
import { SponsorComplianceController } from './controllers/sponsor-compliance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Account,
    JournalEntry,
    JournalLine,
    RevenueSnapshot,
    MilestoneEscrow,
    SponsorInvoice,
    SponsorComplianceRecord,
  ])],
  controllers: [FinancialLedgerController, RevenueDashboardController, MilestoneEscrowController, SponsorInvoiceController, SponsorComplianceController],
  providers: [FinancialLedgerService, RevenueDashboardService, MilestoneEscrowService, SponsorInvoiceService, SponsorComplianceService],
  exports: [TypeOrmModule, SponsorInvoiceService, SponsorComplianceService],
})
export class FinancialLedgerModule {}
