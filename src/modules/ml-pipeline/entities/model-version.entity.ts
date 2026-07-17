import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ModelStatus } from '../enums/model-status.enum';

@Entity('model_versions')
export class ModelVersion extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'modelName', type: 'varchar', length: '255' })
  modelName: string;

  @Column({ name: 'version', type: 'varchar', length: '50' })
  version: string;

  @Column({ name: 'versionNumber', type: 'int' })
  versionNumber: number;

  @Column({ type: 'enum', enum: ModelStatus, default: ModelStatus.TRAINING })
  status: ModelStatus;

  @Column({ name: 'modelPath', type: 'varchar', length: '1000', nullable: true })
  modelPath: string | null;

  @Column({ name: 'framework', type: 'varchar', length: '50', nullable: true })
  framework: string | null;

  @Column({ name: 'accuracy', type: 'decimal', precision: 5, scale: 4, nullable: true })
  accuracy: number | null;

  @Column({ name: 'metrics', type: 'jsonb', nullable: true })
  metrics: Record<string, any> | null;

  @Column({ name: 'trainedByUserId', type: 'uuid', nullable: true })
  trainedByUserId: string | null;

  @Column({ name: 'deployedAt', type: 'timestamp with time zone', nullable: true })
  deployedAt: Date | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
