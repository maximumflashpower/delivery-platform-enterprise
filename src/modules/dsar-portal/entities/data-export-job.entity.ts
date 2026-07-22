import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DataCategory, ExportFormat, ExportJobStatus } from '../enums/dsar.enums';
import { DsarRequest } from './dsar-request.entity';

@Entity('dsar_export_jobs')
export class DataExportJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  requestId: string;

  @ManyToOne(() => DsarRequest, (request) => request.exportJobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requestId' })
  request: DsarRequest;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ExportFormat,
    default: ExportFormat.JSON,
  })
  format: ExportFormat;

  @Column({
    type: 'enum',
    enum: DataCategory,
    array: true,
    default: [],
  })
  includedCategories: DataCategory[];

  @Column({
    type: 'enum',
    enum: ExportJobStatus,
    default: ExportJobStatus.QUEUED,
  })
  status: ExportJobStatus;

  @Column({ type: 'varchar', nullable: true })
  fileUrl: string;

  @Column({ type: 'bigint', nullable: true })
  fileSizeBytes: number;

  @Column({ type: 'int', default: 0 })
  totalRecords: number;

  @Column({ type: 'int', default: 0 })
  processedRecords: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'datetime', nullable: true })
  generatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
