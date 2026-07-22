import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import {
  DsarRequestType,
  DsarRequestStatus,
  DsarPriority,
} from '../enums/dsar.enums';
import { DeletionScope } from './deletion-scope.entity';
import { DataExportJob } from './data-export-job.entity';

@Entity('dsar_requests')
export class DsarRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  userEmail: string;

  @Column({
    type: 'enum',
    enum: DsarRequestType,
    default: DsarRequestType.ACCESS,
  })
  requestType: DsarRequestType;

  @Column({
    type: 'enum',
    enum: DsarRequestStatus,
    default: DsarRequestStatus.SUBMITTED,
  })
  status: DsarRequestStatus;

  @Column({
    type: 'enum',
    enum: DsarPriority,
    default: DsarPriority.NORMAL,
  })
  priority: DsarPriority;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  identityVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DeletionScope, (scope) => scope.request)
  deletionScopes: DeletionScope[];

  @OneToMany(() => DataExportJob, (job) => job.request)
  exportJobs: DataExportJob[];
}
