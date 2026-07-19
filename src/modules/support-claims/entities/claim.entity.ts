import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { ClaimStatus } from '../enums/claim-status.enum';
import { ClaimPriority } from '../enums/claim-priority.enum';
import { ClaimCategory } from '../enums/claim-category.enum';
import { ClaimTicket } from './claim-ticket.entity';
import { ClaimStatusLog } from './claim-status-log.entity';

@Entity('domain_claims')
export class Claim extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  claimNumber: string;

  @Column({ type: 'varchar', nullable: true })
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

  @Column({ type: 'varchar', nullable: true })
  relatedEntityId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  relatedEntityType?: string;

  @Column({ type: 'varchar', nullable: true })
  assignedToUserId?: string;

  @Column({ type: 'datetime', nullable: true })
  openedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  respondedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'text', nullable: true })
  resolutionNotes?: string;
  /**
   * OneToMany - tickets
   */
  @OneToMany(() => ClaimTicket, (entity: any) => entity.claim)
  tickets: ClaimTicket[];

  /**
   * OneToMany - statusLogs
   */
  @OneToMany(() => ClaimStatusLog, (entity: any) => entity.claim)
  statusLogs: ClaimStatusLog[];

}
