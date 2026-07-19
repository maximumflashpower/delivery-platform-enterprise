import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { PayoutMethod } from '../enums/payout-method.enum';
import { PayoutStatus } from '../enums/payout-status.enum';

@Entity('payouts')
export class Payout extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  payoutId: string;

  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: IdentityUser;

  @Column({ type: 'varchar', nullable: true })
  userId?: string;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  amount: number;

  @Column({ type: 'varchar', length: 10 })
  currency: string;

  @Column({ type: 'varchar', length: 50 })
  method: PayoutMethod;

  @Column({ type: 'varchar', length: 50 })
  status: PayoutStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
