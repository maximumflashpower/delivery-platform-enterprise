import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('support_claims_appeal_evidence')
export class AppealEvidence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appealId: string;

  @Column('uuid')
  uploadedByUserId: string;

  @Column('uuid', { nullable: true })
  fileId: string;

  @Column({ length: 100 })
  evidenceType: 'screenshot' | 'document' | 'message_log' | 'witness_statement' | 'other';

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isVerified: boolean;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt: Date;

  @Column('uuid', { nullable: true })
  verifiedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
