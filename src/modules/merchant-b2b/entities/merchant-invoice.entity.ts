import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Merchant } from './merchant.entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';

@Entity('domain_merchant_invoices')
export class MerchantInvoice extends BaseEntity {
  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  @Column({ type: 'uuid' })
  merchantId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  invoiceNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'MXN' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ type: 'date', nullable: true })
  paidDate?: Date;
}
