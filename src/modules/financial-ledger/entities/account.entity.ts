import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { AccountType } from '../enums/account-type.enum';
import { AccountCurrency } from '../enums/account-currency.enum';

@Entity('financial_accounts')
export class Account extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  accountNumber: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: AccountType;

  @Column({ type: 'varchar', length: 10, default: AccountCurrency.MXN })
  currency: AccountCurrency;

  @Column({ type: 'decimal', precision: 19, scale: 4, default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
