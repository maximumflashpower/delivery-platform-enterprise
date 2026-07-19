import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Hauler } from './hauler.entity';
import { LoadStatus } from '../enums/load-status.enum';

@Entity('domain_loads')
export class Load extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  loadNumber: string;

  @ManyToOne(() => Hauler, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'haulerId' })
  hauler?: Hauler;

  @Column({ type: 'varchar', nullable: true })
  haulerId?: string;

  @Column({ type: 'varchar', length: 50, default: LoadStatus.PICKUP_PENDING })
  status: LoadStatus;

  @Column({ type: 'text' })
  pickupLocation: Record<string, any>;

  @Column({ type: 'text' })
  deliveryLocation: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weightKg?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  volumeM3?: number;

  @Column({ type: 'text', nullable: true })
  items?: Array<Record<string, any>>;

  @Column({ type: 'datetime', nullable: true })
  pickedUpAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt?: Date;
}
