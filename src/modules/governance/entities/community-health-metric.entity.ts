import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('governance_community_health_metrics')
@Index(['communityId', 'recordedAt'])
export class CommunityHealthMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  communityId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  recordedAt: Date;

  @Column({ type: 'int', default: 0 })
  totalMembers: number;

  @Column({ type: 'int', default: 0 })
  activeMembers: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  participationRate: number;

  @Column({ type: 'int', default: 0 })
  openProposals: number;

  @Column({ type: 'int', default: 0 })
  closedProposals: number;

  @Column({ type: 'int', default: 0 })
  approvedProposals: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  approvalRate: number;

  @Column({ type: 'int', default: 0 })
  activeAssemblies: number;

  @Column({ type: 'int', default: 0 })
  totalVotes: number;

  @Column({ type: 'int', default: 0 })
  avgTurnoutRate: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 100 })
  trustScore: number;

  @Column({ type: 'int', default: 0 })
  incidentCount: number;

  @Column({ type: 'int', default: 0 })
  disputeCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
