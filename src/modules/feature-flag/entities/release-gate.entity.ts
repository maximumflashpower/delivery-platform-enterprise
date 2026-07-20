import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { DomainOwner } from '../../governance/entities/domain-owner.entity';

export enum GateStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ROLLED_BACK = 'rolled_back'
}

export enum GateType {
  FEATURE_FLAG = 'feature_flag',
  DEPLOYMENT = 'deployment',
  MIGRATION = 'migration',
  CONFIG_CHANGE = 'config_change'
}

@Entity('release_gates')
export class ReleaseGate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: GateType;

  @Column({ type: 'varchar', length: 50, default: GateStatus.PENDING })
  status: GateStatus;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ length: 50 })
  version: string;

  @Column({ length: 100, nullable: true })
  target_environment: string;

  @Column('uuid', { name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => DomainOwner, owner => owner.release_gates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: DomainOwner;

  @Column({ default: false })
  requires_approval: boolean;

  @Column({ type: 'text', nullable: true })
  rollback_instructions: string;

  @Column({ length: 255, nullable: true })
  approved_by: string;

  @Column({ type: 'datetime', nullable: true })
  approved_at: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
