import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Script } from './script.entity';

@Entity('script_templates')
export class ScriptTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  scriptId: string;

  @ManyToOne(() => Script, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scriptId' })
  script: Script;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  configuration: string;

  @Column({ type: 'text', nullable: true })
  defaultInputValues: string;

  @Column({ length: 100, default: 'standard' })
  environment: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  scheduledStart: Date;

  @Column({ type: 'datetime', nullable: true })
  scheduledEnd: Date;

  @Column({ type: 'datetime', nullable: true })
  lastRunAt: Date;

  @Column({ type: 'int', default: 0 })
  runCount: number;

  @Column({ type: 'float', default: 1 })
  concurrencyLimit: number;

  @Column({ type: 'int', default: 3600 })
  timeoutSeconds: number;

  @Column('text', { nullable: true })
  successCallback: string;

  @Column('text', { nullable: true })
  failureCallback: string;

  @Column('text', { nullable: true })
  notifications: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
