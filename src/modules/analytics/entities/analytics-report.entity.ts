import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('analytics_reports')
export class AnalyticsReport extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reportName', type: 'varchar', length: 255 })
  reportName: string;

  @Column({ name: 'reportType', type: 'varchar', length: 100 })
  reportType: string;

  @Column({ name: 'startDate', type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ name: 'endDate', type: 'timestamp with time zone' })
  endDate: Date;

  @Column({ name: 'metrics', type: 'jsonb' })
  metrics: Record<string, any>;

  @Column({ name: 'breakdownDimensions', type: 'jsonb', nullable: true })
  breakdownDimensions: string[] | null;

  @Column({ name: 'generatedByUserId', type: 'uuid' })
  generatedByUserId: string;

  @Column({ type: 'jsonb', nullable: true })
  filters: Record<string, any> | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  outputPath: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
