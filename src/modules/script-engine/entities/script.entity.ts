import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('script_scripts')
export class Script {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column('text')
  sourceCode: string;

  @Column({ length: 100, default: 'javascript' })
  language: 'javascript' | 'typescript' | 'lua' | 'python' | 'custom';

  @Column({ length: 50, default: 'draft' })
  status: 'draft' | 'active' | 'inactive' | 'deprecated' | 'locked';

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column('uuid', { nullable: true })
  createdByUserId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  createdByUser: User;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastExecutedAt: Date;

  @Column({ type: 'int', default: 0 })
  executionCount: number;

  @Column('text', { nullable: true })
  parameters: string;

  @Column('text', { nullable: true })
  metadata: string;

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ type: 'int', default: 30 })
  timeoutSeconds: number;

  @Column({ type: 'int', default: 0 })
  memoryLimitMb: number;

  @Column({ type: 'int', default: 500 })
  maxConcurrency: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deletedAt: Date;

  @OneToMany(() => ScriptExecution, execution => execution.script)
  executions: ScriptExecution[];

  @OneToMany(() => ScriptTemplate, template => template.script)
  templates: ScriptTemplate[];
}
