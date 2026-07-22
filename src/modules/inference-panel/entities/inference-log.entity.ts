import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('inference_logs')
export class InferenceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Index()
  @Column({ type: 'uuid' })
  modelVersionId: string;

  @Column({ type: 'varchar', default: 'prediction' })
  inferenceType: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @Column({ type: 'varchar', default: 'internal' })
  dataSensitivity: string;

  @Column({ type: 'varchar', nullable: true })
  inputHash: string;

  @Column({ type: 'text', nullable: true })
  inputSummary: string;

  @Column({ type: 'text', nullable: true })
  outputSummary: string;

  @Column({ type: 'float', nullable: true })
  confidence: number;

  @Column({ type: 'int', default: 0 })
  latencyMs: number;

  @Column({ type: 'varchar', nullable: true })
  dataSource: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'datetime', nullable: true })
  executedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
