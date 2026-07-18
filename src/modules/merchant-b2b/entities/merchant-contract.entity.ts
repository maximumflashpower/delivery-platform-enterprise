import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Merchant } from './merchant.entity';
import { ContractStatus } from '../enums/contract-status.enum';

@Entity('domain_merchant_contracts')
export class MerchantContract extends BaseEntity {
  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  @Column({ type: 'uuid' })
  merchantId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  contractNumber: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'varchar', length: 50, default: ContractStatus.DRAFT })
  status: ContractStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionRate: number;

  @Column({ type: 'text', nullable: true })
  terms?: Record<string, any>;
}
