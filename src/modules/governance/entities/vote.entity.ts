import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { Proposal } from './proposal.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('governance_votes')
@Unique(['proposalId', 'userId', 'ballotId'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  proposalId: string;

  @ManyToOne(() => Proposal, proposal => proposal.votes, { onDelete: 'CASCADE' })
  proposal: Proposal;

  @Column('uuid', { nullable: true })
  ballotId: string;

  @Column({ type: 'boolean', default: true })
  isValid: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1 })
  weight: number;

  @Column({ length: 20, default: 'yes' })
  choice: 'yes' | 'no' | 'abstain' | 'blank';

  @Column('text', { nullable: true })
  rationale: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  votedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
