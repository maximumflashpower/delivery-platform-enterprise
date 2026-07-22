import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('ia_decision_appeals')
export class IaDecisionAppeal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appealId: string;

  @Column('uuid', { nullable: true })
  decisionId: string | null;

  @Column('varchar', { length: 200 })
  modelName: string;

  @Column('varchar', { length: 100 })
  modelId: string;

  @Column('varchar', { length: 50 })
  decisionType: 'content_moderation' | 'risk_assessment' | 'policy_violation' | 'safety_flag';

  @Column('text', { nullable: true })
  aiReasoning: string | null;

  @Column('float', { nullable: true })
  confidenceScore: number | null;

  @Column('varchar', { length: 20, default: 'pending_review' })
  reviewStatus: 'pending_review' | 'under_human_review' | 'upheld' | 'overturned' | 'escalated';

  @Column('uuid', { nullable: true })
  humanReviewerId: string | null;

  @Column('text', { nullable: true })
  humanReviewNotes: string | null;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  escalatedAt: Date;

  @Column('boolean', { default: false })
  requiresBoardReview: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
