import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Hauler } from './hauler.entity';
import { RequestStatus } from '../enums/request-status.enum';

@Entity('domain_moving_requests')
export class MovingRequest extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  requestCode: string;

  @Column({ type: 'uuid', nullable: true })
  customerId?: string;

  @ManyToOne(() => Hauler, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'haulerId' })
  hauler?: Hauler;

  @Column({ type: 'uuid', nullable: true })
  haulerId?: string;

  @Column({ type: 'varchar', length: 50, default: RequestStatus.SUBMITTED })
  status: RequestStatus;

  @Column({ type: 'text' })
  originAddress: Record<string, any>;

  @Column({ type: 'text' })
  destinationAddress: Record<string, any>;

  @Column({ type: 'date' })
  movingDate: Date;

  @Column({ type: 'integer', nullable: true })
  estimatedVolumeM3?: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, nullable: true })
  quotedPrice?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
