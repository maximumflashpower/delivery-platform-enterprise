import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('rate_limit_configs')
export class RateLimitConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('varchar', { length: 100 })
  configName: string;

  @Column('varchar', { length: 20, default: 'active' })
  status: string;

  // Requests per time window
  @Column('int', { default: 100 })
  maxRequestsPerMinute: number;

  @Column('int', { default: 1000 })
  maxRequestsPerHour: number;

  @Column('int', { default: 10000 })
  maxRequestsPerDay: number;

  // Token limits
  @Column('int', { default: 100000 })
  maxTokensPerMinute: number;

  @Column('int', { default: 500000 })
  maxTokensPerHour: number;

  @Column('int', { default: 5000000 })
  maxTokensPerDay: number;

  // Cost limits
  @Column('decimal', { precision: 10, scale: 2, default: 10.00 })
  maxCostPerDay: number;

  @Column('decimal', { precision: 10, scale: 2, default: 100.00 })
  maxCostPerMonth: number;

  // Burst & throttle settings
  @Column('int', { default: 10 })
  burstSize: number;

  @Column('int', { default: 5000 })
  cooldownMs: number;

  @Column('varchar', { length: 20, default: 'reject' })
  excessAction: string;

  // Circuit breaker
  @Column('boolean', { default: true })
  circuitBreakerEnabled: boolean;

  @Column('int', { default: 5 })
  circuitBreakerThreshold: number;

  @Column('int', { default: 30000 })
  circuitBreakerTimeoutMs: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
