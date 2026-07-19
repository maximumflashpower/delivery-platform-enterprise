import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FlagStrategy } from '../enums/flag-strategy.enum';
import { FlagStatus } from '../enums/flag-status.enum';

@Entity('feature_flags')
export class FeatureFlag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'flag_key', type: 'varchar', length: 100, unique: true })
  flagKey: string;

  @Column({ name: 'flag_name', type: 'varchar', length: 255 })
  flagName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 50, default: 'BOOLEAN' })
  strategy: string;

  @Column({ type: 'varchar', length: 50, default: 'DISABLED' })
  status: string;

  @Column({ name: 'default_value', type: 'boolean', default: false })
  defaultValue: boolean;

  @Column({ type: 'text', nullable: true })
  config: string | null;

  @Column({ name: 'created_by_user_id', type: 'varchar', length: 36 })
  createdByUserId: string;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime', onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
