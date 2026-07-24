import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { RevenueSnapshot } from './entities/revenue-snapshot.entity';
import { MilestoneEscrow } from './entities/milestone-escrow.entity';
import { SponsorInvoice } from './entities/sponsor-invoice.entity';
import { SponsorComplianceRecord } from './entities/sponsor-compliance-record.entity';
import { ProductionCostCalculation } from './entities/production-cost-calculation.entity';
import { CostLineItem } from './entities/cost-line-item.entity';
import { IncomeProtectionPolicy } from './entities/income-protection-policy.entity';
import { ProtectionClaim } from './entities/protection-claim.entity';
import { FinancialLedgerService } from './services/financial-ledger.service';
import { RevenueDashboardService } from './services/revenue-dashboard.service';
import { MilestoneEscrowService } from './services/milestone-escrow.service';
import { SponsorInvoiceService } from './services/sponsor-invoice.service';
import { SponsorComplianceService } from './services/sponsor-compliance.service';
import { ProductionCostCalculationService } from './services/production-cost-calculation.service';
import { IncomeProtectionService } from './services/income-protection.service';
import { FinancialLedgerController } from './controllers/financial-ledger.controller';
import { RevenueDashboardController } from './controllers/revenue-dashboard.controller';
import { MilestoneEscrowController } from './controllers/milestone-escrow.controller';
import { SponsorInvoiceController } from './controllers/sponsor-invoice.controller';
import { SponsorComplianceController } from './controllers/sponsor-compliance.controller';
import { ProductionCostCalculatorController } from './controllers/production-cost-calculator.controller';
import { IncomeProtectionController } from './controllers/income-protection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Account,
    JournalEntry,
    JournalLine,
    RevenueSnapshot,
    MilestoneEscrow,
    SponsorInvoice,
    SponsorComplianceRecord,
    ProductionCostCalculation,
    CostLineItem,
    IncomeProtectionPolicy,
    ProtectionClaim,
  ])],
  controllers: [
    FinancialLedgerController,
    RevenueDashboardController,
    MilestoneEscrowController,
    SponsorInvoiceController,
    SponsorComplianceController,
    ProductionCostCalculatorController,
    IncomeProtectionController,
  ],
  providers: [
    FinancialLedgerService,
    RevenueDashboardService,
    MilestoneEscrowService,
    SponsorInvoiceService,
    SponsorComplianceService,
    ProductionCostCalculationService,
    IncomeProtectionService,
  ],
  exports: [TypeOrmModule, SponsorInvoiceService, SponsorComplianceService, ProductionCostCalculationService, IncomeProtectionService],
})
export class FinancialLedgerModule {}
