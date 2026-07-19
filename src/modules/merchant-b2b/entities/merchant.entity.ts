import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { MerchantStatus } from '../enums/merchant-status.enum';
import { TierLevel } from '../enums/tier-level.enum';
import { MerchantContract } from './merchant-contract.entity';
import { MerchantInvoice } from './merchant-invoice.entity';

@Entity('domain_merchants')
export class Merchant extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner?: IdentityUser;

  @Column({ type: 'varchar', nullable: true })
  ownerId?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  merchantCode: string;

  @Column({ type: 'varchar', length: 255 })
  legalName: string;

  @Column({ type: 'varchar', length: 255 })
  tradeName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  taxId?: string;

  @Column({ type: 'varchar', length: 50, default: MerchantStatus.PENDING })
  status: MerchantStatus;

  @Column({ type: 'varchar', length: 50, default: TierLevel.BRONZE })
  tier: TierLevel;

  @Column({ type: 'text', nullable: true })
  businessAddress?: Record<string, any>;
  /**
   * OneToMany - contracts
   */
  @OneToMany(() => MerchantContract, (entity: any) => entity.merchant)
  contracts: MerchantContract[];

  /**
   * OneToMany - invoices
   */
  @OneToMany(() => MerchantInvoice, (entity: any) => entity.merchant)
  invoices: MerchantInvoice[];

}
