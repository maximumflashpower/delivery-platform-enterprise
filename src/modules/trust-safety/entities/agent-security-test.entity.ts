import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('agent_security_tests')
export class AgentSecurityTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('varchar', { length: 100 })
  agentName: string;

  @Column('varchar', { length: 100 })
  testScenarioName: string;

  @Column('varchar', { length: 20, default: 'pending' })
  status: string;

  @Column('varchar', { length: 30, default: 'low' })
  riskLevel: string;

  @Column('varchar', { length: 50, default: 'automated' })
  testType: string;

  @Column('text', { nullable: true })
  testDescription: string | null;

  @Column('text', { nullable: true })
  inputPayload: string | null;

  @Column('json', { nullable: true })
  toolAccessList: any;

  @Column('varchar', { length: 20, default: 'v1' })
  testFrameworkVersion: string;

  @Column('uuid', { nullable: true })
  createdByUserId: string | null;

  @Column({ type: 'datetime', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date | null;

  @Column('int', { default: 0 })
  durationMs: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
