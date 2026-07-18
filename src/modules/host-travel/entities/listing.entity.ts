import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Host } from './host.entity';
import { ListingStatus } from '../enums/listing-status.enum';
import { PropertyType } from '../enums/property-type.enum';

@Entity('domain_listings')
export class Listing extends BaseEntity {
  @ManyToOne(() => Host, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostId' })
  host: Host;

  @Column({ type: 'uuid' })
  hostId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  listingCode: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, default: PropertyType.ENTIRE_HOME })
  propertyType: PropertyType;

  @Column({ type: 'varchar', length: 50, default: ListingStatus.UNDER_REVIEW })
  status: ListingStatus;

  @Column({ type: 'decimal', precision: 19, scale: 4, default: 0 })
  nightlyPrice: number;

  @Column({ type: 'varchar', length: 10, default: 'MXN' })
  currency: string;

  @Column({ type: 'integer', default: 1 })
  maxGuests: number;

  @Column({ type: 'integer', default: 1 })
  bedrooms: number;

  @Column({ type: 'integer', default: 1 })
  bathrooms: number;

  @Column({ type: 'text' })
  location: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  amenities?: string[];

  @Column({ type: 'text', nullable: true })
  photos?: Array<Record<string, any>>;
}
