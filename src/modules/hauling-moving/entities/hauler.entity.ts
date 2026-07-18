import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { HaulerStatus } from '../enums/hauler-status.enum';

@Entity('domain_haulers')
export class Hauler extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: IdentityUser;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  haulerCode: string;

  @Column({ type: 'varchar', length: 255 })
  companyName: string;

  @Column({ type: 'varchar', length: 50, default: HaulerStatus.ACTIVE })
  status: HaulerStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  totalJobs: number;

  @Column({ type: 'text', nullable: true })
  serviceAreas?: string[];

  @Column({ type: 'text', nullable: true })
  equipmentTypes?: string[];
}
