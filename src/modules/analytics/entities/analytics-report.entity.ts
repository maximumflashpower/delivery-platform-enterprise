import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('analytics_reports')
export class AnalyticsReport extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reportName', type: 'varchar', length: 255 })
  reportName: string;

  @Column({ name: 'reportType', type: 'varchar', length: 100 })
  reportType: string;

  @Column({ name: 'startDate', type: 'datetime' })
  startDate: Date;

  @Column({ name: 'endDate', type: 'datetime' })
  endDate: Date;

  @Column({ name: 'metrics', type: 'text' })
  metrics: Record<string, any>;

  @Column({ name: 'breakdownDimensions', type: 'text', nullable: true })
  breakdownDimensions: string[] | null;

  @Column({ name: 'generatedByUserId', type: 'varchar' })
  generatedByUserId: string;

  @Column({ type: 'text', nullable: true })
  filters: Record<string, any> | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  outputPath: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
