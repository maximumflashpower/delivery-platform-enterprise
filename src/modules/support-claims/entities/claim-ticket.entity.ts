import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Claim } from './claim.entity';

@Entity('domain_claim_tickets')
export class ClaimTicket extends BaseEntity {
  @ManyToOne(() => Claim, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claimId' })
  claim: Claim;

  @Column({ type: 'varchar' })
  claimId: string;

  @Column({ type: 'varchar', length: 50, default: 'customer' })
  authorType: string;

  @Column({ type: 'varchar', nullable: true })
  authorId?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  attachments?: string[];

  @Column({ type: 'boolean', default: false })
  isInternal: boolean;
}
