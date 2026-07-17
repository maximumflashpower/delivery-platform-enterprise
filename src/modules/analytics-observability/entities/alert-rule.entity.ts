import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { AlertSeverity } from '../enums/alert-severity.enum';

@Entity('alert_rules')
export class AlertRule extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ruleName', type: 'varchar', length: '255' })
  ruleName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'metricType', type: 'varchar', length: '50' })
  metricType: string;

  @Column({ name: 'condition', type: 'varchar', length: '255' })
  condition: string;

  @Column({ name: 'threshold', type: 'decimal', precision: 14, scale: 4 })
  threshold: number;

  @Column({ name: 'evaluationInterval', type: 'varchar', length: '50', default: "'1m'" })
  evaluationInterval: string;

  @Column({ type: 'enum', enum: AlertSeverity, default: AlertSeverity.WARNING })
  severity: AlertSeverity;

  @Column({ name: 'notificationChannels', type: 'jsonb', nullable: true })
  notificationChannels: string[] | null;

  @Column({ name: 'cooldownPeriod', type: 'varchar', length: '50', default: "'5m'" })
  cooldownPeriod: string;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'triggeredCount', type: 'bigint', default: 0 })
  triggeredCount: number;

  @Column({ name: 'lastTriggeredAt', type: 'timestamp with time zone', nullable: true })
  lastTriggeredAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
