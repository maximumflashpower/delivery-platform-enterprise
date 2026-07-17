import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { FlagStrategy } from '../enums/flag-strategy.enum';
import { FlagStatus } from '../enums/flag-status.enum';

@Entity('feature_flags')
export class FeatureFlag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'flagKey', type: 'varchar', length: 100, unique: true })
  flagKey: string;

  @Column({ name: 'flagName', type: 'varchar', length: 255 })
  flagName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: FlagStrategy, default: FlagStrategy.BOOLEAN })
  strategy: FlagStrategy;

  @Column({ type: 'enum', enum: FlagStatus, default: FlagStatus.DISABLED })
  status: FlagStatus;

  @Column({ name: 'defaultValue', type: 'boolean', default: false })
  defaultValue: boolean;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any> | null;

  @Column({ name: 'createdByUserId', type: 'uuid' })
  createdByUserId: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
