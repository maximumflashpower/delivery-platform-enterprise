import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ClaimResolution {
  PENDING = 'pending',
  APPROVED = 'approved',
  PARTIALLY_APPROVED = 'partially_approved',
  DENIED = 'denied',
  ESCALATED = 'escalated',
}

@Entity('income_protection_claims')
export class ProtectionClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  policyId: string;

  @Column({ type: 'uuid' })
  claimantId: string;

  @Column({ type: 'varchar', length: 200 })
  claimTitle: string;

  @Column({ type: 'text' })
  claimDescription: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  claimedAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  approvedAmount: number;

  @Column({ type: 'varchar', length: 50, default: 'filed' })
  status: string;

  @Column({ type: 'varchar', length: 50, default: ClaimResolution.PENDING })
  resolution: ClaimResolution;

  @Column({ type: 'datetime' })
  incidentDate: Date;

  @Column({ type: 'datetime', nullable: true })
  filedDate: Date;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string | null;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  reviewNotes: string | null;

  @Column({ type: 'text', nullable: true })
  evidence: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  deductibleApplied: number;

  @Column({ type: 'varchar', length: 50, default: 'USD' })
  currency: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
