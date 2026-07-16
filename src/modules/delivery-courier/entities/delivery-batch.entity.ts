import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Courier } from './courier.entity';
import { BatchStatus } from '../enums/batch-status.enum';

@Entity('domain_delivery_batches')
export class DeliveryBatch extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  batchNumber: string;

  @ManyToOne(() => Courier, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'courierId' })
  courier?: Courier;

  @Column({ type: 'uuid', nullable: true })
  courierId?: string;

  @Column({ type: 'varchar', length: 50, default: BatchStatus.PENDING })
  status: BatchStatus;

  @Column({ type: 'integer', default: 0 })
  totalItems: number;

  @Column({ type: 'integer', default: 0 })
  completedItems: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  totalDistanceKm?: number;
}
