import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ComplianceStatus } from '../enums/compliance-status.enum';

@Entity('compliance_records')
export class ComplianceRecord extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'policyId', type: 'uuid' })
  policyId: string;

  @Column({ name: 'entityType', type: 'varchar', length: 100 })
  entityType: string;

  @Column({ name: 'entityId', type: 'uuid' })
  entityId: string;

  @Column({ type: 'enum', enum: ComplianceStatus, default: ComplianceStatus.PENDING_REVIEW })
  status: ComplianceStatus;

  @Column({ name: 'assessmentDate', type: 'date' })
  assessmentDate: Date;

  @Column({ name: 'nextReviewDate', type: 'date', nullable: true })
  nextReviewDate: Date | null;

  @Column({ name: 'auditorId', type: 'uuid', nullable: true })
  auditorId: string | null;

  @Column({ name: 'findings', type: 'jsonb', nullable: true })
  findings: Record<string, any> | null;

  @Column({ name: 'remediationPlan', type: 'jsonb', nullable: true })
  remediationPlan: Record<string, any> | null;

  @Column({ name: 'comments', type: 'text', nullable: true })
  comments: string | null;

  @Column({ name: 'isCritical', type: 'boolean', default: false })
  isCritical: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
