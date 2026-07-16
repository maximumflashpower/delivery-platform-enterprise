import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Shipment } from './shipment.entity';

@Entity('domain_bills_of_lading')
export class BillOfLading extends BaseEntity {
  @ManyToOne(() => Shipment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shipmentId' })
  shipment: Shipment;

  @Column({ type: 'uuid' })
  shipmentId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  bolNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'jsonb' })
  shipperInfo: Record<string, any>;

  @Column({ type: 'jsonb' })
  consigneeInfo: Record<string, any>;

  @Column({ type: 'jsonb' })
  notifyPartyInfo?: Record<string, any>;

  @Column({ type: 'jsonb' })
  items: Array<Record<string, any>>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalWeightKg?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  specialInstructions?: string;

  @Column({ type: 'boolean', default: false })
  isSigned: boolean;

  @Column({ type: 'timestamp', nullable: true })
  signedAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  signerName?: string;
}
