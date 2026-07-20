import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum CommunityType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  MODERATED = 'moderated',
  FEDERATED = 'federated',
  TEMPORARY = 'temporary'
}

export enum MembershipApproval {
  OPEN = 'open',
  REQUEST_REQUIRED = 'request_required',
  INVITE_ONLY = 'invite_only'
}

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Index()
  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  community_type: CommunityType;

  @Column({ type: 'varchar', length: 50, default: MembershipApproval.OPEN })
  membership_approval: MembershipApproval;

  @Column('uuid', { name: 'owner_id' })
  ownerId: string;

  @Column({ type: 'uuid', nullable: true })
  parent_community_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  language: string;

  @Column({ type: 'text', nullable: true })
  rules: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  banner_url: string;

  @Column({ type: 'integer', default: 0 })
  member_count: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  archived_at: Date;
}
