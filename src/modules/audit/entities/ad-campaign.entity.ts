import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum CampaignType {
  PRODUCT = 'product',
  POLITICAL = 'political',
  ISSUE = 'issue',
  SPONSORSHIP = 'sponsorship',
  PROMOTIONAL = 'promotional',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

@Entity('ad_campaigns')
export class AdCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'campaign_name', type: 'varchar', length: 255 })
  campaignName: string;

  @Column({ name: 'advertiser_id', type: 'varchar', length: 255 })
  advertiserId: string;

  @Column({ name: 'advertiser_name', type: 'varchar', length: 255 })
  advertiserName: string;

  @Column({ name: 'campaign_type', type: 'varchar', length: 30, default: CampaignType.PRODUCT })
  campaignType: CampaignType;

  @Column({ name: 'status', type: 'varchar', length: 20, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Column({ name: 'total_budget', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalBudget: number;

  @Column({ name: 'spent_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  spentAmount: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'start_date', type: 'datetime', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'datetime', nullable: true })
  endDate: Date | null;

  @Column({ name: 'target_audience', type: 'text', nullable: true })
  targetAudience: string | null;

  @Column({ name: 'disclosure_required', type: 'boolean', default: true })
  disclosureRequired: boolean;

  @Column({ name: 'is_political', type: 'boolean', default: false })
  isPolitical: boolean;

  @Column({ name: 'reviewed_by', type: 'varchar', length: 255, nullable: true })
  reviewedBy: string | null;

  @Column({ name: 'reviewed_at', type: 'datetime', nullable: true })
  reviewedAt: Date | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
