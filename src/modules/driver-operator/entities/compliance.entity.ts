import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Driver } from './driver.entity';
import { ComplianceStatus } from '../enums/compliance-status.enum';

@Entity('domain_driver_compliance')
export class Compliance extends BaseEntity {
  @ManyToOne(() => Driver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column({ type: 'uuid' })
  driverId: string;

  @Column({ type: 'varchar', length: 100 })
  requirement: string;

  @Column({ type: 'varchar', length: 50, default: ComplianceStatus.PENDING_REVIEW })
  status: ComplianceStatus;

  @Column({ type: 'date', nullable: true })
  verifiedAt?: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
