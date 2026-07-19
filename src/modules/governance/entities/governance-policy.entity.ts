import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PolicyType } from '../enums/policy-type.enum';

@Entity('governance_policies')
export class GovernancePolicy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'policyName', type: 'varchar', length: 255 })
  policyName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', enum: PolicyType })
  type: PolicyType;

  @Column({ name: 'jurisdiction', type: 'varchar', length: 100 })
  jurisdiction: string;

  @Column({ name: 'version', type: 'varchar', length: 50 })
  version: string;

  @Column({ name: 'effectiveDate', type: 'date' })
  effectiveDate: Date;

  @Column({ name: 'expiryDate', type: 'date', nullable: true })
  expiryDate: Date | null;

  @Column({ name: 'documentPath', type: 'varchar', length: 1000, nullable: true })
  documentPath: string | null;

  @Column({ name: 'approvalStatus', type: 'varchar', length: 50, default: 'draft' })
  approvalStatus: string;

  @Column({ name: 'approvedBy', type: 'varchar', length: 255, nullable: true })
  approvedBy: string | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
