import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { Proposal } from './proposal.entity';
import { Ballot } from './ballot.entity';

@Entity('governance_votes')
@Unique(['proposalId', 'userId', 'ballotId'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  proposalId: string;

  @ManyToOne(() => Proposal, proposal => proposal.votes, { onDelete: 'CASCADE' })
  proposal: Proposal;

  @Column('uuid', { nullable: true })
  ballotId: string | null;

  @ManyToOne(() => Ballot, ballot => ballot.votes, { onDelete: 'SET NULL' })
  ballot: Ballot;

  @Column({ type: 'boolean', default: true })
  isValid: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1 })
  weight: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  choice: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  votedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  revokedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
