import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('agent_tool_inventory')
export class AgentToolInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  agentId: string;

  @Column('varchar', { length: 100 })
  toolName: string;

  @Column('varchar', { length: 50 })
  toolType: string;

  @Column('varchar', { length: 20, default: 'enabled' })
  status: string;

  @Column('varchar', { length: 30, default: 'medium' })
  riskRating: string;

  @Column('text', { nullable: true })
  permissionsScope: string | null;

  @Column('boolean', { default: false })
  requiresApproval: boolean;

  @Column('boolean', { default: true })
  auditEnabled: boolean;

  @Column('text', { nullable: true })
  rateLimitConfig: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
