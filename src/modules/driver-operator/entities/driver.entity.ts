import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { DriverStatus } from '../enums/driver-status.enum';
import { License } from './license.entity';
import { Compliance } from './compliance.entity';

@Entity('domain_drivers')
export class Driver extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: IdentityUser;

  @Column({ type: 'varchar', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  driverCode: string;

  @Column({ type: 'varchar', length: 50, default: DriverStatus.ACTIVE })
  status: DriverStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  backgroundCheckId?: string;

  @Column({ type: 'date', nullable: true })
  backgroundCheckExpiry?: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  totalTrips: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;
  /**
   * OneToMany - licenses
   */
  @OneToMany(() => License, (entity: any) => entity.driver)
  licenses: License[];

  /**
   * OneToMany - compliance
   */
  @OneToMany(() => Compliance, (entity: any) => entity.driver)
  compliance: Compliance[];

}
