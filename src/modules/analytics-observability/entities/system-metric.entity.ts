import { Entity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { SystemMetricType } from '../enums/system-metric-type.enum';

@Entity('system_metrics')
export class SystemMetric extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serviceName', type: 'varchar', length: '255' })
  serviceName: string;

  @Column({ name: 'instanceId', type: 'varchar', length: '255', nullable: true })
  instanceId: string | null;

  @Column({ type: 'enum', enum: SystemMetricType })
  metricType: SystemMetricType;

  @Column({ name: 'metricValue', type: 'decimal', precision: 14, scale: 4 })
  metricValue: number;

  @Column({ name: 'unit', type: 'varchar', length: '50', nullable: true })
  unit: string | null;

  @Column({ name: 'labels', type: 'jsonb', nullable: true })
  labels: Record<string, string> | null;

  @Column({ name: 'collectedAt', type: 'timestamp with time zone' })
  collectedAt: Date;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
