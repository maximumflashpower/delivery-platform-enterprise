import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ActivityType } from '../enums/activity-type.enum';

@Entity('wellness_activities')
export class WellnessActivity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'goalId', type: 'uuid', nullable: true })
  goalId: string | null;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({ name: 'activityName', type: 'varchar', length: '255' })
  activityName: string;

  @Column({ name: 'durationMinutes', type: 'int', nullable: true })
  durationMinutes: number | null;

  @Column({ name: 'metricValue', type: 'decimal', precision: 10, scale: 2, nullable: true })
  metricValue: number | null;

  @Column({ name: 'unit', type: 'varchar', length: '50', nullable: true })
  unit: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'startTime', type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ name: 'endTime', type: 'timestamp with time zone', nullable: true })
  endTime: Date | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
