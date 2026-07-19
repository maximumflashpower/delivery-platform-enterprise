import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { ServiceProvider } from './service-provider.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('domain_service_bookings')
export class ServiceBooking extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  bookingCode: string;

  @ManyToOne(() => ServiceProvider, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'providerId' })
  provider?: ServiceProvider;

  @Column({ type: 'varchar', nullable: true })
  providerId?: string;

  @Column({ type: 'varchar', nullable: true })
  customerId?: string;

  @Column({ type: 'varchar', nullable: true })
  categoryId?: string;

  @Column({ type: 'varchar', length: 255 })
  serviceName: string;

  @Column({ type: 'datetime' })
  scheduledAt: Date;

  @Column({ type: 'integer', nullable: true })
  durationMinutes?: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, nullable: true })
  quotedPrice?: number;

  @Column({ type: 'varchar', length: 50, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  location?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
