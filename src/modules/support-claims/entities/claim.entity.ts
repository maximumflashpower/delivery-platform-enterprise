import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { ClaimStatus } from '../enums/claim-status.enum';
import { ClaimPriority } from '../enums/claim-priority.enum';
import { ClaimCategory } from '../enums/claim-category.enum';

@Entity('domain_claims')
export class Claim extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  claimNumber: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 50, default: ClaimStatus.OPEN })
  status: ClaimStatus;

  @Column({ type: 'varchar', length: 50, default: ClaimPriority.MEDIUM })
  priority: ClaimPriority;

  @Column({ type: 'varchar', length: 50, default: ClaimCategory.OTHER })
  category: ClaimCategory;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  relatedEntityType?: string;

  @Column({ type: 'uuid', nullable: true })
  assignedToUserId?: string;

  @Column({ type: 'timestamp', nullable: true })
  openedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'text', nullable: true })
  resolutionNotes?: string;
}
