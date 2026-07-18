import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { RideStatus } from '../enums/ride-status.enum';
import { RideType } from '../enums/ride-type.enum';

@Entity('rides')
export class Ride extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  rideId: string;

  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'passengerId' })
  passenger?: IdentityUser;

  @Column({ type: 'uuid', nullable: true })
  passengerId?: string;

  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driverId' })
  driver?: IdentityUser;

  @Column({ type: 'uuid', nullable: true })
  driverId?: string;

  @Column({ type: 'varchar', length: 50 })
  type: RideType;

  @Column({ type: 'varchar', length: 50 })
  status: RideStatus;

  @Column({ type: 'decimal', precision: 19, scale: 4, nullable: true })
  fare?: number;

  @Column({ type: 'text', nullable: true })
  locations?: Record<string, { lat: number; lng: number; address: string }>;
}
