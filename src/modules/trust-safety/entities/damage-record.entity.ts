import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DamageType {
  PHYSICAL = 'physical',
  FINANCIAL = 'financial',
  REPUTATIONAL = 'reputational',
  OPERATIONAL = 'operational',
  DATA = 'data',
  LEGAL = 'legal'
}

export enum DamageSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum DamageStatus {
  REPORTED = 'reported',
  INVESTIGATING = 'investigating',
  CONFIRMED = 'confirmed',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed'
}

@Entity('damage_records')
export class DamageRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  damage_type: DamageType;

  @Column({ type: 'varchar', length: 50 })
  severity: DamageSeverity;

  @Column({ type: 'varchar', length: 50, default: DamageStatus.REPORTED })
  status: DamageStatus;

  @Column('uuid', { name: 'reported_by', nullable: true })
  reportedBy: string;

  @Column('uuid', { name: 'affected_entity_id', nullable: true })
  affectedEntityId: string;

  @Column({ length: 100, nullable: true })
  affected_entity_type: string;

  @Column({ type: 'text', nullable: true })
  impact_description: string;

  @Column({ type: 'text', nullable: true })
  resolution_notes: string;

  @Column({ type: 'datetime', nullable: true })
  resolved_at: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
