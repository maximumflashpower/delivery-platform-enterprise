import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Payout } from './payout.entity';

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AssessmentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('sponsor_risk_assessments')
export class SponsorRiskAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sponsor_id', type: 'varchar', length: 255 })
  sponsorId: string;

  @Column({ name: 'sponsor_name', type: 'varchar', length: 255 })
  sponsorName: string;

  @Column({ name: 'risk_level', type: 'varchar', length: 20, default: RiskLevel.MEDIUM })
  riskLevel: RiskLevel;

  @Column({ name: 'risk_score', type: 'decimal', precision: 5, scale: 2, default: 50.0 })
  riskScore: number;

  @Column({ name: 'assessment_status', type: 'varchar', length: 20, default: AssessmentStatus.PENDING })
  assessmentStatus: AssessmentStatus;

  @Column({ name: 'max_exposure', type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxExposure: number | null;

  @Column({ name: 'assessed_by', type: 'varchar', length: 255, nullable: true })
  assessedBy: string | null;

  @Column({ name: 'assessed_at', type: 'datetime', nullable: true })
  assessedAt: Date | null;

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'flags', type: 'text', nullable: true })
  flags: string | null;

  @ManyToOne(() => Payout, { nullable: true })
  @JoinColumn({ name: 'payout_id' })
  payout: Payout | null;

  @Column({ name: 'payout_id', type: 'varchar', nullable: true })
  payoutId: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
