import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sandbox_instances')
export class SandboxInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('varchar', { length: 200 })
  agentName: string;

  @Column('varchar', { length: 100, default: 'default' })
  configName: string;

  @Column('varchar', { length: 200, default: 'agent-sandbox:latest' })
  imageRef: string;

  @Column('int', { default: 80 })
  maxCpuPercent: number;

  @Column('int', { default: 512 })
  maxMemoryMb: number;

  @Column('int', { default: 1024 })
  maxDiskMb: number;

  @Column('int', { default: 60000 })
  maxExecutionTimeMs: number;

  @Column('int', { default: 10000 })
  maxTokensPerExecution: number;

  @Column('int', { default: 50 })
  maxApiCallsPerExecution: number;

  @Column('boolean', { default: false })
  networkAccess: boolean;

  @Column('text', { nullable: true })
  allowedHosts: string | null;

  @Column('text', { nullable: true })
  envVars: string | null;

  @Column('varchar', { length: 20, default: 'created' })
  status: 'created' | 'running' | 'paused' | 'terminated';

  @Column('datetime', { nullable: true })
  startedAt: Date | null;

  @Column('datetime', { nullable: true })
  terminatedAt: Date | null;

  @Column('varchar', { length: 200, nullable: true })
  terminationReason: string | null;

  @Column('int', { default: 0 })
  totalExecutions: number;

  @Column('int', { default: 0 })
  totalTokensUsed: number;

  @Column('int', { default: 0 })
  totalApiCalls: number;

  @Column('decimal', { precision: 10, scale: 6, default: 0 })
  totalCost: number;

  @Column('varchar', { length: 36, nullable: true })
  lastExecutionId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
