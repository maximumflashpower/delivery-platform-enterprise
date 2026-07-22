import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('context_firewall_rules')
export class ContextFirewallRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('varchar', { length: 100 })
  ruleName: string;

  @Column('varchar', { length: 20, default: 'active' })
  status: string;

  @Column('varchar', { length: 30, default: 'block' })
  action: string;

  @Column('varchar', { length: 50, default: 'keyword' })
  ruleType: string;

  @Column('text')
  pattern: string;

  @Column('varchar', { length: 50, default: 'all' })
  appliesTo: string;

  @Column('int', { default: 100 })
  priority: number;

  @Column('boolean', { default: true })
  caseSensitive: boolean;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('uuid', { nullable: true })
  createdByUserId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
