import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('support_claims_appeals')
export class Appeal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  claimId: string;

  @Column('uuid')
  userId: string;

  @Column({ length: 100 })
  appealType: 'content_removal' | 'account_action' | 'policy_violation' | 'false_report' | 'other';

  @Column('text')
  groundsForAppeal: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ length: 50, default: 'submitted' })
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';

  @Column('text', { nullable: true })
  additionalEvidence: string;

  @Column('uuid', { nullable: true })
  reviewerId: string;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date;

  @Column('text', { nullable: true })
  reviewerDecision: string;

  @Column('text', { nullable: true })
  outcomeExplanation: string;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
