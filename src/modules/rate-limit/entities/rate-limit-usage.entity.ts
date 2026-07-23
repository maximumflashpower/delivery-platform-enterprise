import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('rate_limit_usage')
export class RateLimitUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('uuid', { nullable: true })
  sessionId: string | null;

  @Column('varchar', { length: 50 })
  windowType: string;

  @Column('datetime')
  windowStart: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  windowEnd: Date;

  @Column('int', { default: 0 })
  requestCount: number;

  @Column('int', { default: 0 })
  tokenCount: number;

  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  costAmount: number;

  @Column('int', { default: 0 })
  rejectedCount: number;

  @Column('int', { default: 0 })
  throttledCount: number;

  @Column('float', { nullable: true })
  avgResponseTimeMs: number | null;

  @Column('float', { nullable: true })
  p99ResponseTimeMs: number | null;

  @Column('varchar', { length: 20, default: 'normal' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
