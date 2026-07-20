import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RiskCategory {
  SYSTEMIC = 'systemic',
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  COMPLIANCE = 'compliance',
  SECURITY = 'security',
  PRIVACY = 'privacy'
}

export enum RiskLevel {
  NEGLIGIBLE = 'negligible',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum RiskStatus {
  IDENTIFIED = 'identified',
  ASSESSED = 'assessed',
  MITIGATED = 'mitigated',
  ACCEPTED = 'accepted',
  ESCALATED = 'escalated'
}

@Entity('risk_assessments')
export class RiskAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  risk_category: RiskCategory;

  @Column({ type: 'varchar', length: 50 })
  risk_level: RiskLevel;

  @Column({ type: 'varchar', length: 50, default: RiskStatus.IDENTIFIED })
  status: RiskStatus;

  @Column({ type: 'text', nullable: true })
  mitigation_plan: string;

  @Column({ type: 'text', nullable: true })
  contingency_plan: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  likelihood: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  impact: string;

  @Column('uuid', { name: 'assessed_by', nullable: true })
  assessedBy: string;

  @Column({ type: 'datetime', nullable: true })
  reviewed_at: Date;

  @Column({ type: 'datetime', nullable: true })
  next_review_date: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
