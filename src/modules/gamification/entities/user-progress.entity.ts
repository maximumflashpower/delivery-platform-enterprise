import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ProgressStatus } from '../enums/progress-status.enum';

@Entity('user_progress')
export class UserProgress extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'achievementId', type: 'uuid' })
  achievementId: string;

  @Column({ type: 'varchar', enum: ProgressStatus, default: ProgressStatus.NOT_STARTED })
  status: ProgressStatus;

  @Column({ name: 'progressValue', type: 'int', default: 0 })
  progressValue: number;

  @Column({ name: 'progressTarget', type: 'int', nullable: true })
  progressTarget: number | null;

  @Column({ name: 'unlockedAt', type: 'datetime', nullable: true })
  unlockedAt: Date | null;

  @Column({ name: 'earnedPoints', type: 'int', default: 0 })
  earnedPoints: number;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
