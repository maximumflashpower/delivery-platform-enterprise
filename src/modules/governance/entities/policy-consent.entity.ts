import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ConsentAction {
  AGREED = 'agreed',
  DISAGREED = 'disagreed',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired'
}

@Entity('policy_consents')
export class PolicyConsent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Index()
  @Column('uuid', { name: 'policy_id' })
  policyId: string;

  @Column({ type: 'varchar', length: 50 })
  action: ConsentAction;

  @Column({ type: 'varchar', length: 100 })
  version: string;

  @Column({ type: 'datetime' })
  agreed_at: Date;

  @Column({ type: 'datetime', nullable: true })
  withdrawn_at: Date;

  @Column({ type: 'text', nullable: true })
  withdrawal_reason: string;

  @Column('uuid', { name: 'consented_by', nullable: true })
  consentedBy: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
