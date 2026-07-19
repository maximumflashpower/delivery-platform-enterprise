import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { ServiceBooking } from './service-booking.entity';

@Entity('domain_service_categories')
export class ServiceCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  iconUrl?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  /**
   * OneToMany - serviceBookings
   */
  @OneToMany(() => ServiceBooking, (entity: any) => entity.category)
  serviceBookings: ServiceBooking[];

}
