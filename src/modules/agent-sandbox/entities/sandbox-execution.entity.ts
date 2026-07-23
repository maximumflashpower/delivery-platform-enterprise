import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sandbox_executions')
export class SandboxExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sandboxId: string;

  @Column('uuid')
  agentId: string;

  @Column('text')
  inputPayload: string;

  @Column('varchar', { length: 20, default: 'queued' })
  status: 'queued' | 'running' | 'completed' | 'failed';

  @Column('int', { default: 0 })
  tokensUsed: number;

  @Column('int', { default: 0 })
  apiCallsMade: number;

  @Column('int', { default: 0 })
  toolsInvoked: number;

  @Column('int', { default: 0 })
  executionTimeMs: number;

  @Column('int', { default: 0 })
  peakMemoryMb: number;

  @Column('int', { default: 0 })
  avgCpuPercent: number;

  @Column('decimal', { precision: 10, scale: 6, default: 0 })
  estimatedCost: number;

  @Column('text', { nullable: true })
  outputPayload: string | null;

  @Column('text', { nullable: true })
  errorMessage: string | null;

  @Column('int', { nullable: true })
  exitCode: number | null;

  @Column('datetime', { nullable: true })
  startedAt: Date | null;

  @Column('datetime', { nullable: true })
  completedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
