import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('experiment_variants')
export class ExperimentVariant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'experimentId', type: 'uuid' })
  experimentId: string;

  @Column({ name: 'variantName', type: 'varchar', length: '100' })
  variantName: string;

  @Column({ name: 'variantKey', type: 'varchar', length: '50' })
  variantKey: string;

  @Column({ name: 'trafficPercentage', type: 'int', default: 0 })
  trafficPercentage: number;

  @Column({ name: 'configuration', type: 'jsonb', nullable: true })
  configuration: Record<string, any> | null;

  @Column({ name: 'conversionRate', type: 'decimal', precision: 5, scale: 4, nullable: true })
  conversionRate: number | null;

  @Column({ name: 'impressions', type: 'bigint', default: 0 })
  impressions: number;

  @Column({ name: 'conversions', type: 'bigint', default: 0 })
  conversions: number;

  @Column({ name: 'isControl', type: 'boolean', default: false })
  isControl: boolean;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
