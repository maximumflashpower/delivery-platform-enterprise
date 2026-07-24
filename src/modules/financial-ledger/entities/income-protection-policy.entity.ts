import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum PolicyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLAIMED = 'claimed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum PolicyType {
  REVENUE_LOSS = 'revenue_loss',
  PARTNER_DEFAULT = 'partner_default',
  CAMPAIGN_FAILURE = 'campaign_failure',
  SUPPLY_DISRUPTION = 'supply_disruption',
  SEASONAL_PROTECTION = 'seasonal_protection',
}

export enum ClaimStatus {
  NONE = 'none',
  FILED = 'filed',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  PAID = 'paid',
}

@Entity('income_protection_policies')
export class IncomeProtectionPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  merchantId: string;

  @Column({ type: 'varchar', length: 200 })
  policyName: string;

  @Column({ type: 'varchar', length: 50, default: PolicyType.REVENUE_LOSS })
  policyType: PolicyType;

  @Column({ type: 'varchar', length: 50, default: PolicyStatus.DRAFT })
  status: PolicyStatus;

  @Column({ type: 'uuid', nullable: true })
  partnerId: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  partnerName: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  coverageAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  premiumAmount: number;

  @Column({ type: 'varchar', length: 50, default: 'MONTHLY' })
  premiumFrequency: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10 })
  deductiblePercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 80 })
  coveragePercent: number;

  @Column({ type: 'datetime' })
  effectiveDate: Date;

  @Column({ type: 'datetime' })
  expirationDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalPremiumsPaid: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalClaimsPaid: number;

  @Column({ type: 'int', default: 0 })
  claimsFiled: number;

  @Column({ type: 'varchar', length: 50, default: ClaimStatus.NONE })
  claimStatus: ClaimStatus;

  @Column({ type: 'datetime', nullable: true })
  lastClaimDate: Date | null;

  @Column({ type: 'text', nullable: true })
  terms: string | null;

  @Column({ type: 'text', nullable: true })
  conditions: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  waitingPeriodDays: number;

  @Column({ type: 'boolean', default: false })
  autoRenew: boolean;

  @Column({ type: 'varchar', length: 50, default: 'USD' })
  currency: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;
}
