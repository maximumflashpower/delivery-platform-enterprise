import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('identity_explainability_records')
export class ExplainabilityRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ length: 100 })
  decisionType: string;

  @Column('uuid', { nullable: true })
  decisionRefId: string;

  @Column('text')
  explanation: string;

  @Column('text', { nullable: true })
  factors: string;

  @Column('text', { nullable: true })
  inputData: string;

  @Column('text', { nullable: true })
  outputData: string;

  @Column({ type: 'float', nullable: true })
  confidenceScore: number;

  @Column('text', { nullable: true })
  modelVersion: string;

  @Column({ length: 50, default: 'generated' })
  status: 'generated' | 'reviewed' | 'disputed' | 'archived';

  @Column('uuid', { nullable: true })
  reviewedBy: string;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date;

  @Column('text', { nullable: true })
  userFeedback: string;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
