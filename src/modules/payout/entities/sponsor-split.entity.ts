import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { SponsorRiskAssessment } from './sponsor-risk-assessment.entity';
import { SplitParticipant } from './split-participant.entity';

export enum SplitType {
  COLLABORATION = 'collaboration',
  SPONSOR_RISK = 'sponsor_risk',
  HYBRID = 'hybrid',
}

export enum SplitStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  EXECUTED = 'executed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('sponsor_splits')
export class SponsorSplit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'split_type', type: 'varchar', length: 30, default: SplitType.COLLABORATION })
  splitType: SplitType;

  @Column({ name: 'status', type: 'varchar', length: 20, default: SplitStatus.DRAFT })
  status: SplitStatus;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'reference_id', type: 'varchar', length: 255, nullable: true })
  referenceId: string | null;

  @Column({ name: 'reference_type', type: 'varchar', length: 100, nullable: true })
  referenceType: string | null;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'smart_contract_id', type: 'varchar', nullable: true })
  smartContractId: string | null;

  @Column({ name: 'execution_tx_hash', type: 'varchar', length: 255, nullable: true })
  executionTxHash: string | null;

  @Column({ name: 'executed_at', type: 'datetime', nullable: true })
  executedAt: Date | null;

  @Column({ name: 'created_by', type: 'varchar', length: 255 })
  createdBy: string;

  @Column({ name: 'approved_by', type: 'varchar', length: 255, nullable: true })
  approvedBy: string | null;

  @Column({ name: 'approved_at', type: 'datetime', nullable: true })
  approvedAt: Date | null;

  @ManyToOne(() => SponsorRiskAssessment, { nullable: true })
  @JoinColumn({ name: 'risk_assessment_id' })
  riskAssessment: SponsorRiskAssessment | null;

  @Column({ name: 'risk_assessment_id', type: 'varchar', nullable: true })
  riskAssessmentId: string | null;

  @OneToMany(() => SplitParticipant, (participant) => participant.split, { cascade: true })
  participants: SplitParticipant[];

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
