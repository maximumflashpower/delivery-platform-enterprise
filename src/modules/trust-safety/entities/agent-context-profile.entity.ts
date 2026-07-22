import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('agent_context_profiles')
export class AgentContextProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('varchar', { length: 100 })
  profileName: string;

  @Column('varchar', { length: 20, default: 'active' })
  status: string;

  @Column('varchar', { length: 20, default: 'standard' })
  clearanceLevel: string;

  @Column('text', { nullable: true })
  allowedDomains: string | null;

  @Column('text', { nullable: true })
  blockedDomains: string | null;

  @Column('boolean', { default: true })
  piiFiltering: boolean;

  @Column('boolean', { default: true })
  credentialFiltering: boolean;

  @Column('boolean', { default: false })
  systemPromptProtection: boolean;

  @Column('int', { default: 50000 })
  maxContextLength: number;

  @Column('int', { default: 5 })
  maxRequestsPerMinute: number;

  @Column('boolean', { default: true })
  auditLogging: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
