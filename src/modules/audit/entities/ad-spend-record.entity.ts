import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ad_spend_records')
export class AdSpendRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'campaign_id', type: 'varchar' })
  campaignId: string;

  @Column({ name: 'spend_date', type: 'datetime' })
  spendDate: Date;

  @Column({ name: 'amount', type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'spend_category', type: 'varchar', length: 50, nullable: true })
  spendCategory: string | null;

  @Column({ name: 'vendor', type: 'varchar', length: 255, nullable: true })
  vendor: string | null;

  @Column({ name: 'impressions', type: 'int', default: 0 })
  impressions: number;

  @Column({ name: 'clicks', type: 'int', default: 0 })
  clicks: number;

  @Column({ name: 'reach', type: 'int', default: 0 })
  reach: number;

  @Column({ name: 'journal_entry_id', type: 'varchar', nullable: true })
  journalEntryId: string | null;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;
}
