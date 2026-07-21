import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Script } from './script.entity';

@Entity('script_executions')
export class ScriptExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  scriptId: string;

  @ManyToOne(() => Script, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scriptId' })
  script: Script;

  @Column('uuid', { nullable: true })
  triggeredByUserId: string;

  @Column('uuid', { nullable: true })
  triggerId: string;

  @Column({ length: 100, default: 'manual' })
  triggerType: string;

  @Column({ length: 50, default: 'running' })
  status: string;

  @Column('text', { nullable: true })
  inputParameters: string;

  @Column('text', { nullable: true })
  outputResult: string;

  @Column('text', { nullable: true })
  errorMessage: string;

  @Column({ type: 'int', default: 0 })
  executionTimeMs: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  timedOutAt: Date;

  @Column('text', { nullable: true })
  logs: string;

  @Column({ type: 'int', default: 1 })
  retryAttempt: number;

  @Column({ type: 'datetime', nullable: true })
  retryScheduledAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
