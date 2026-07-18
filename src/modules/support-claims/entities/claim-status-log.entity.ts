import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Claim } from './claim.entity';

@Entity('domain_claim_status_logs')
export class ClaimStatusLog extends BaseEntity {
  @ManyToOne(() => Claim, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claimId' })
  claim: Claim;

  @Column({ type: 'uuid' })
  claimId: string;

  @Column({ type: 'varchar', length: 50 })
  previousStatus: string;

  @Column({ type: 'varchar', length: 50 })
  newStatus: string;

  @Column({ type: 'uuid', nullable: true })
  changedByUserId?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  changedAt: Date;

  @Column({ type: 'text', nullable: true })
  reason?: string;
}
