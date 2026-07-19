import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
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

  @Column({ name: 'evaluationInterval', type: 'varchar', length: '50', default: '1m' })
  evaluationInterval: string;

  @Column({ type: 'varchar', enum: AlertSeverity, default: AlertSeverity.WARNING })
  severity: AlertSeverity;

  @Column({ name: 'notificationChannels', type: 'text', nullable: true })
  notificationChannels: string[] | null;

  @Column({ name: 'cooldownPeriod', type: 'varchar', length: '50', default: '5m' })
  cooldownPeriod: string;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'triggeredCount', type: 'bigint', default: 0 })
  triggeredCount: number;

  @Column({ name: 'lastTriggeredAt', type: 'datetime', nullable: true })
  lastTriggeredAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
