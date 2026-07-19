import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { CarrierStatus } from '../enums/carrier-status.enum';

@Entity('domain_carriers')
export class Carrier extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: IdentityUser;

  @Column({ type: 'varchar', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  carrierCode: string;

  @Column({ type: 'varchar', length: 255 })
  companyName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mcNumber?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dotNumber?: string;

  @Column({ type: 'varchar', length: 50, default: CarrierStatus.PENDING_VERIFICATION })
  status: CarrierStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  totalShipments: number;

  @Column({ type: 'text', nullable: true })
  serviceRegions?: string[];

  @Column({ type: 'text', nullable: true })
  equipmentTypes?: string[];
}
