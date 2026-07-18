import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { JobStatus } from '../enums/job-status.enum';
import { JobPriority } from '../enums/job-priority.enum';

@Entity('domain_jobs')
export class Job extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  jobCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: JobStatus.PENDING })
  status: JobStatus;

  @Column({ type: 'varchar', length: 50, default: JobPriority.MEDIUM })
  priority: JobPriority;

  @Column({ type: 'varchar', length: 255 })
  jobType: string;

  @Column({ type: 'text', nullable: true })
  payload?: Record<string, any>;

  @Column({ type: 'datetime', nullable: true })
  scheduledAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  startedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt?: Date;

  @Column({ type: 'integer', default: 0 })
  retryCount: number;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true })
  metadata?: Record<string, any>;
}
