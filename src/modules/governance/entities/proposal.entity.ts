import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Assembly } from './assembly.entity';
import { Vote } from './vote.entity';

@Entity('governance_proposals')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 50, default: 'informational' })
  category: 'informational' | 'policy' | 'funding' | 'structural' | 'electoral';

  @Column({ length: 50, default: 'pending' })
  status: 'draft' | 'pending' | 'under_review' | 'active' | 'approved' | 'rejected' | 'expired';

  @Column('uuid')
  assemblyId: string;

  @ManyToOne(() => Assembly, assembly => assembly.proposals, { onDelete: 'CASCADE' })
  assembly: Assembly;

  @OneToMany(() => Vote, vote => vote.proposal)
  votes: Vote[];

  @Column({ type: 'int', default: 0 })
  voteCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  approvalRate: number;

  @Column({ length: 255, nullable: true })
  submittedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  submissionDeadline: Date;

  @Column({ type: 'timestamp', nullable: true })
  votingStartDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  votingEndDate: Date;

  @Column('text', { nullable: true })
  outcome: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
