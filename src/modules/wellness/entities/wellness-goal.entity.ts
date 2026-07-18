import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { WellnessGoalType } from '../enums/wellness-goal-type.enum';

@Entity('wellness_goals')
export class WellnessGoal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'goalName', type: 'varchar', length: '255' })
  goalName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', enum: WellnessGoalType })
  type: WellnessGoalType;

  @Column({ name: 'targetValue', type: 'decimal', precision: 10, scale: 2 })
  targetValue: number;

  @Column({ name: 'unit', type: 'varchar', length: '50' })
  unit: string;

  @Column({ name: 'frequency', type: 'varchar', length: '50', nullable: true })
  frequency: string | null;

  @Column({ name: 'startDate', type: 'date' })
  startDate: Date;

  @Column({ name: 'targetDate', type: 'date', nullable: true })
  targetDate: Date | null;

  @Column({ name: 'currentValue', type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentValue: number;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'isCompleted', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completedAt', type: 'date', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
