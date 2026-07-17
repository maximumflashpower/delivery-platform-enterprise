import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { AchievementType } from '../enums/achievement-type.enum';

@Entity('achievements')
export class Achievement extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'achievementName', type: 'varchar', length: '255' })
  achievementName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: AchievementType })
  type: AchievementType;

  @Column({ name: 'iconUrl', type: 'varchar', length: '500', nullable: true })
  iconUrl: string | null;

  @Column({ name: 'points', type: 'int', default: 10 })
  points: number;

  @Column({ name: 'requirement', type: 'jsonb' })
  requirement: Record<string, any>;

  @Column({ name: 'isVisible', type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ name: 'isSecret', type: 'boolean', default: false })
  isSecret: boolean;

  @Column({ name: 'unlockCount', type: 'bigint', default: 0 })
  unlockCount: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
