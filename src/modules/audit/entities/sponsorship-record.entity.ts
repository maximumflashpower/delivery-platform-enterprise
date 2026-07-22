import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum SponsorshipType {
  CONTENT = 'content',
  EVENT = 'event',
  CREATOR = 'creator',
  PLATFORM = 'platform',
  PARTNERSHIP = 'partnership',
}

export enum SponsorshipStatus {
  PROPOSED = 'proposed',
  DISCLOSED = 'disclosed',
  ACTIVE = 'active',
  ENDED = 'ended',
  TERMINATED = 'terminated',
}

@Entity('sponsorship_records')
export class SponsorshipRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sponsor_id', type: 'varchar', length: 255 })
  sponsorId: string;

  @Column({ name: 'sponsor_name', type: 'varchar', length: 255 })
  sponsorName: string;

  @Column({ name: 'sponsor_type', type: 'varchar', length: 50, nullable: true })
  sponsorType: string | null;

  @Column({ name: 'beneficiary_id', type: 'varchar', length: 255 })
  beneficiaryId: string;

  @Column({ name: 'beneficiary_name', type: 'varchar', length: 255 })
  beneficiaryName: string;

  @Column({ name: 'sponsorship_type', type: 'varchar', length: 30, default: SponsorshipType.CONTENT })
  sponsorshipType: SponsorshipType;

  @Column({ name: 'status', type: 'varchar', length: 20, default: SponsorshipStatus.PROPOSED })
  status: SponsorshipStatus;

  @Column({ name: 'agreement_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
  agreementValue: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'disclosure_text', type: 'text', nullable: true })
  disclosureText: string | null;

  @Column({ name: 'is_disclosed', type: 'boolean', default: false })
  isDisclosed: boolean;

  @Column({ name: 'disclosed_at', type: 'datetime', nullable: true })
  disclosedAt: Date | null;

  @Column({ name: 'start_date', type: 'datetime', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'datetime', nullable: true })
  endDate: Date | null;

  @Column({ name: 'terms_url', type: 'varchar', length: 500, nullable: true })
  termsUrl: string | null;

  @Column({ name: 'campaign_id', type: 'varchar', nullable: true })
  campaignId: string | null;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
