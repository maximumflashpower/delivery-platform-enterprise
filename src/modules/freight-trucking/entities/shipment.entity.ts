import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Carrier } from './carrier.entity';
import { ShipmentStatus } from '../enums/shipment-status.enum';
import { CargoType } from '../enums/cargo-type.enum';

@Entity('domain_shipments')
export class Shipment extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  shipmentNumber: string;

  @ManyToOne(() => Carrier, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'carrierId' })
  carrier?: Carrier;

  @Column({ type: 'varchar', nullable: true })
  carrierId?: string;

  @Column({ type: 'varchar', length: 50, default: ShipmentStatus.BOOKED })
  status: ShipmentStatus;

  @Column({ type: 'varchar', length: 50, default: CargoType.DRY_FREIGHT })
  cargoType: CargoType;

  @Column({ type: 'text' })
  pickupLocation: Record<string, any>;

  @Column({ type: 'text' })
  deliveryLocation: Record<string, any>;

  @Column({ type: 'datetime' })
  pickupDateTime: Date;

  @Column({ type: 'datetime', nullable: true })
  deliveryDateTime?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weightKg?: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, nullable: true })
  freightCharge?: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  proofOfDelivery?: Record<string, any>;
}
