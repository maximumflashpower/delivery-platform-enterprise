import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SimulationStatus {
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum SimulationType {
  RATE_LIMIT = 'rate_limit',
  AUTH_BRUTE_FORCE = 'auth_brute_force',
  DATA_EXFILTRATION = 'data_exfiltration',
  INJECTION_ATTACK = 'injection_attack',
  DOS = 'dos',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  FUNCTION_ABUSE = 'function_abuse',
}

@Entity('abuse_simulations')
export class AbuseSimulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  simulationName: string;

  @Column({ type: 'varchar', length: 50 })
  simulationType: SimulationType;

  @Column({ type: 'varchar', length: 50, default: SimulationStatus.SCHEDULED })
  status: SimulationStatus;

  @Column({ type: 'text', nullable: true })
  targetFunction: string;

  @Column({ type: 'json', nullable: true })
  attackVector: Record<string, any>;

  @Column({ type: 'integer', default: 100 })
  requestCount: number;

  @Column({ type: 'integer', default: 0 })
  executedRequests: number;

  @Column({ type: 'integer', nullable: true })
  successfulAttacks: number;

  @Column({ type: 'integer', nullable: true })
  blockedAttacks: number;

  @Column({ type: 'float', nullable: true })
  successRate: number;

  @Column({ type: 'text', nullable: true })
  findings: string;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'datetime', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'datetime', nullable: true })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
