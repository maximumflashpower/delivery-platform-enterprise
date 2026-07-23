import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('circuit_breaker_states')
export class CircuitBreakerState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('varchar', { length: 20, default: 'closed' })
  state: string;

  @Column('int', { default: 0 })
  failureCount: number;

  @Column('datetime', { nullable: true })
  lastFailureAt: Date | null;

  @Column('datetime', { nullable: true })
  openedAt: Date | null;

  @Column('datetime', { nullable: true })
  lastCheckedAt: Date | null;

  @Column('int', { default: 0 })
  consecutiveSuccessCount: number;

  @Column('varchar', { length: 200, nullable: true })
  failureReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
