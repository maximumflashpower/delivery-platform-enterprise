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
import { DataCategory, DeletionScopeStatus } from '../enums/dsar.enums';
import { DsarRequest } from './dsar-request.entity';

@Entity('dsar_deletion_scopes')
export class DeletionScope {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  requestId: string;

  @ManyToOne(() => DsarRequest, (request) => request.deletionScopes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requestId' })
  request: DsarRequest;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: DataCategory,
    array: true,
    default: [DataCategory.PROFILE],
  })
  categories: DataCategory[];

  @Column({
    type: 'enum',
    enum: DeletionScopeStatus,
    default: DeletionScopeStatus.PENDING,
  })
  status: DeletionScopeStatus;

  @Column({ type: 'text', nullable: true })
  justification: string;

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  executedAt: Date;

  @Column({ type: 'int', default: 0 })
  recordsAffected: number;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'jsonb', nullable: true })
  rollbackData: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
