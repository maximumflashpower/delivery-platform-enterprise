import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum MembershipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  WITHDRAWN = 'withdrawn'
}

export enum JoinReason {
  INTEREST = 'interest',
  PROFESSIONAL = 'professional',
  INVITED = 'invited',
  ASSIGNED = 'assigned',
  REQUIRED = 'required'
}

@Entity('community_memberships')
export class CommunityMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'community_id' })
  communityId: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  role_id: string;

  @Column({ type: 'varchar', length: 50, default: MembershipStatus.PENDING })
  status: MembershipStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  join_reason: JoinReason;

  @Column('uuid', { name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ type: 'text', nullable: true })
  approved_comments: string;

  @Column({ type: 'datetime', nullable: true })
  joined_at: Date;

  @Column({ type: 'datetime', nullable: true })
  left_at: Date;

  @Column({ type: 'datetime', nullable: true })
  suspended_until: Date;

  @Column({ type: 'text', nullable: true })
  suspension_reason: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
