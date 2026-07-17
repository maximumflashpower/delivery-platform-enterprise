import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { SustainabilityMetricType } from '../enums/sustainability-metric-type.enum';

@Entity('sustainability_metrics')
export class SustainabilityMetric extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'entityType', type: 'varchar', length: '100' })
  entityType: string;

  @Column({ name: 'entityId', type: 'uuid' })
  entityId: string;

  @Column({ type: 'enum', enum: SustainabilityMetricType })
  metricType: SustainabilityMetricType;

  @Column({ name: 'metricValue', type: 'decimal', precision: 14, scale: 4 })
  metricValue: number;

  @Column({ name: 'unit', type: 'varchar', length: '50' })
  unit: string;

  @Column({ name: 'recordedAt', type: 'timestamp with time zone' })
  recordedAt: Date;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
