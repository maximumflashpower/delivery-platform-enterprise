import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { RecurrencePattern } from '../enums/recurrence-pattern.enum';

@Entity('domain_schedules')
export class Schedule extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  scheduleCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  cronExpression: string;

  @Column({ type: 'varchar', length: 50, default: RecurrencePattern.ONCE })
  recurrencePattern: RecurrencePattern;

  @Column({ type: 'varchar', length: 255 })
  jobType: string;

  @Column({ type: 'text', nullable: true })
  jobPayload?: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'time', nullable: true })
  timezone?: string;

  @Column({ type: 'text', nullable: true })
  exceptions?: string[];

  @Column({ type: 'datetime', nullable: true })
  lastRunAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  nextRunAt?: Date;
}
