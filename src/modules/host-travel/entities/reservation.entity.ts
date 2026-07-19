import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Listing } from './listing.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { IdentityUser } from '../../identity/entities/identity-user.entity';

@Entity('domain_reservations')
export class Reservation extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  reservationCode: string;

  @ManyToOne(() => Listing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;

  @Column({ type: 'varchar' })
  listingId: string;

  @Column({ type: 'varchar', nullable: true })
  guestId?: string;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column({ type: 'integer', default: 1 })
  guestCount: number;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  totalPrice: number;

  @Column({ type: 'varchar', length: 10, default: 'MXN' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @Column({ type: 'datetime', nullable: true })
  checkedInAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  checkedOutAt?: Date;

  @Column({ type: 'text', nullable: true })
  specialRequests?: string;
  /**
   * OneToMany - listing
   */
  /**
   * OneToMany - guest
   */
  @OneToMany(() => IdentityUser, (entity: any) => entity.reservationsAsGuest)
  guest: IdentityUser[];

}
