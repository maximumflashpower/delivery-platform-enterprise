import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { SponsorSplit } from './sponsor-split.entity';

export enum ParticipantRole {
  CREATOR = 'creator',
  COLLABORATOR = 'collaborator',
  SPONSOR = 'sponsor',
  PLATFORM = 'platform',
  SERVICE_PROVIDER = 'service_provider',
  COURIER = 'courier',
}

@Entity('split_participants')
export class SplitParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'split_id', type: 'varchar' })
  splitId: string;

  @ManyToOne(() => SponsorSplit, (split) => split.participants)
  @JoinColumn({ name: 'split_id' })
  split: SponsorSplit;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Column({ name: 'user_name', type: 'varchar', length: 255 })
  userName: string;

  @Column({ name: 'role', type: 'varchar', length: 30 })
  role: ParticipantRole;

  @Column({ name: 'share_percentage', type: 'decimal', precision: 5, scale: 2 })
  sharePercentage: number;

  @Column({ name: 'share_amount', type: 'decimal', precision: 15, scale: 2 })
  shareAmount: number;

  @Column({ name: 'risk_adjustment', type: 'decimal', precision: 5, scale: 2, default: 0 })
  riskAdjustment: number;

  @Column({ name: 'contribution_score', type: 'decimal', precision: 5, scale: 2, default: 50.0 })
  contributionScore: number;

  @Column({ name: 'payout_id', type: 'varchar', nullable: true })
  payoutId: string | null;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
