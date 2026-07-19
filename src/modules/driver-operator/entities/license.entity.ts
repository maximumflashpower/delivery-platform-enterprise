import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Driver } from './driver.entity';
import { LicenseStatus } from '../enums/license-status.enum';

@Entity('domain_driver_licenses')
export class License extends BaseEntity {
  @ManyToOne(() => Driver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column({ type: 'varchar' })
  driverId: string;

  @Column({ type: 'varchar', length: 100 })
  licenseNumber: string;

  @Column({ type: 'varchar', length: 50 })
  licenseClass: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  issuingState?: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column({ type: 'varchar', length: 50, default: LicenseStatus.VALID })
  status: LicenseStatus;
}
