import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { HostStatus } from '../enums/host-status.enum';
import { Listing } from './listing.entity';

@Entity('domain_hosts')
export class Host extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: IdentityUser;

  @Column({ type: 'varchar', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  hostCode: string;

  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'varchar', length: 50, default: HostStatus.PENDING_VERIFICATION })
  status: HostStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  totalListings: number;

  @Column({ type: 'integer', default: 0 })
  totalReservations: number;

  @Column({ type: 'boolean', default: true })
  isSuperHost: boolean;

  @Column({ type: 'text', nullable: true })
  responseTime?: Record<string, any>;
  /**
   * OneToMany - listings
   */
  @OneToMany(() => Listing, (entity: any) => entity.host)
  listings: Listing[];

}
