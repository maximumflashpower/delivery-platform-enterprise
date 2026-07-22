import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('agent_security_results')
export class AgentSecurityResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  testId: string;

  @Column('uuid')
  agentId: string;

  @Column('varchar', { length: 20, default: 'pass' })
  overallResult: string;

  @Column('int', { default: 0 })
  findingsCount: number;

  @Column('int', { default: 0 })
  criticalFindings: number;

  @Column('int', { default: 0 })
  warningsCount: number;

  @Column('text', { nullable: true })
  summary: string | null;

  @Column('json', { nullable: true })
  findings: any;

  @Column('text', { nullable: true })
  remediationNotes: string | null;

  @Column('float', { nullable: true })
  securityScore: number | null;

  @Column('varchar', { length: 50, default: 'automated_scan' })
  assessmentMethod: string;

  @CreateDateColumn()
  createdAt: Date;
}
