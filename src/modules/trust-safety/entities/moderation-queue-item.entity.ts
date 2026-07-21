import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('trust_safety_moderation_queue')
export class ModerationQueueItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  contentId: string;

  @Column({ length: 50 })
  contentType: 'post' | 'comment' | 'message' | 'profile' | 'file' | 'other';

  @Column('uuid')
  reportedByUserId: string;

  @Column('uuid', { nullable: true })
  flaggedUserId: string | null;

  @Column({ length: 100 })
  reasonCode: string;

  @Column('text', { nullable: true })
  reasonDescription: string;

  @Column('text', { nullable: true })
  evidence: string;

  @Column({ length: 50, default: 'pending' })
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'removed' | 'escalated';

  @Column('uuid', { nullable: true })
  moderatorId: string | null;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date;

  @Column('text', { nullable: true })
  moderatorNotes: string | null;

  @Column({ length: 50, nullable: true })
  actionTaken: 'none' | 'warning' | 'content_removed' | 'user_banned' | 'suspended' | 'reported_authorities';

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
