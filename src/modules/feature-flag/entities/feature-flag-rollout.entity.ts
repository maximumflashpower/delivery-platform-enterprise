import { Entity, Column, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { FeatureFlag } from './feature-flag.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('feature_flag_rollouts')
export class FeatureFlagRollout extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'flag_id', type: 'varchar', length: 36 })
  flagId: string;

  @ManyToOne(() => FeatureFlag, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'flag_id' })
  flag: FeatureFlag | null;

  @Column({ name: 'target_type', type: 'varchar', length: 50 })
  targetType: string;

  @Column({ name: 'target_value', type: 'varchar', length: 255 })
  targetValue: string;

  @Column({ name: 'rollout_percentage', type: 'int', default: 100 })
  rolloutPercentage: number;

  @Column({ type: 'text', nullable: true })
  conditions: string | null;

  @Column({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime', onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
