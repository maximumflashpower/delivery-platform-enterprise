import { Entity, Column, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('feature_flag_rollouts')
export class FeatureFlagRollout extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'flagId', type: 'uuid' })
  flagId: string;

  @ManyToOne(() => Object, { nullable: true })
  @JoinColumn({ name: 'flagId' })
  flag: any;

  @Column({ name: 'targetType', type: 'varchar', length: 50 })
  targetType: string;

  @Column({ name: 'targetValue', type: 'varchar', length: 255 })
  targetValue: string;

  @Column({ name: 'rolloutPercentage', type: 'int', default: 100 })
  rolloutPercentage: number;

  @Column({ type: 'jsonb', nullable: true })
  conditions: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
