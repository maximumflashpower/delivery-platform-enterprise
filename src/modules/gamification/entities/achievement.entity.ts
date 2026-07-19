import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AchievementType } from '../enums/achievement-type.enum';

@Entity('achievements')
export class Achievement extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'achievementName', type: 'varchar', length: '255' })
  achievementName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', enum: AchievementType })
  type: AchievementType;

  @Column({ name: 'iconUrl', type: 'varchar', length: '500', nullable: true })
  iconUrl: string | null;

  @Column({ name: 'points', type: 'int', default: 10 })
  points: number;

  @Column({ name: 'requirement', type: 'text' })
  requirement: Record<string, any>;

  @Column({ name: 'isVisible', type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ name: 'isSecret', type: 'boolean', default: false })
  isSecret: boolean;

  @Column({ name: 'unlockCount', type: 'bigint', default: 0 })
  unlockCount: number;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
