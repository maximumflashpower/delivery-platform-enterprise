import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('support_claims_victim_cases')
export class VictimSupportCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ length: 100 })
  caseType: 'harassment' | 'threats' | 'identity_theft' | 'doxxing' | 'impersonation' | 'other';

  @Column('text')
  description: string;

  @Column({ type: 'boolean', default: false })
  isUrgent: boolean;

  @Column({ length: 50, default: 'open' })
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

  @Column('uuid', { nullable: true })
  assignedSupportAgent: string | null;

  @Column('text', { nullable: true })
  safetyPlan: string | null;

  @Column('text', { nullable: true })
  evidenceReferences: string | null;

  @Column('text', { nullable: true })
  externalActions: string | null;

  @Column({ type: 'datetime', nullable: true })
  closedAt: Date;

  @Column('text', { nullable: true })
  closureReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
