import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('context_filter_logs')
export class ContextFilterLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('uuid', { nullable: true })
  sessionId: string | null;

  @Column('varchar', { length: 20, default: 'allowed' })
  filterResult: string;

  @Column('text')
  originalContext: string;

  @Column('text', { nullable: true })
  filteredContext: string | null;

  @Column('int', { default: 0 })
  rulesTriggered: number;

  @Column('json', { nullable: true })
  triggeredRuleIds: any;

  @Column('varchar', { length: 100, nullable: true })
  blockedReason: string | null;

  @Column('int', { default: 0 })
  originalLength: number;

  @Column('int', { default: 0 })
  filteredLength: number;

  @Column('float', { nullable: true })
  processingTimeMs: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
