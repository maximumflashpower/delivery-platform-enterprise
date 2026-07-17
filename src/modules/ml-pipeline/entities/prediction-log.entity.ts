import { Entity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { PredictionStatus } from '../enums/prediction-status.enum';

@Entity('prediction_logs')
export class PredictionLog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'modelId', type: 'uuid' })
  modelId: string;

  @Column({ name: 'modelVersion', type: 'varchar', length: '50' })
  modelVersion: string;

  @Column({ name: 'userId', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'inputData', type: 'jsonb' })
  inputData: Record<string, any>;

  @Column({ name: 'predictionResult', type: 'jsonb', nullable: true })
  predictionResult: Record<string, any> | null;

  @Column({ type: 'enum', enum: PredictionStatus, default: PredictionStatus.PENDING })
  status: PredictionStatus;

  @Column({ name: 'confidenceScore', type: 'decimal', precision: 5, scale: 4, nullable: true })
  confidenceScore: number | null;

  @Column({ name: 'processingTimeMs', type: 'int', nullable: true })
  processingTimeMs: number | null;

  @Column({ name: 'error', type: 'text', nullable: true })
  error: string | null;

  @Column({ name: 'sessionId', type: 'varchar', length: '255', nullable: true })
  sessionId: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
