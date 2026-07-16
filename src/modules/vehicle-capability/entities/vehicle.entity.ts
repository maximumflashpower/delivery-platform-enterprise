import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { VehicleType } from '../enums/vehicle-type.enum';
import { VehicleStatus } from '../enums/vehicle-status.enum';

@Entity('vehicles')
export class Vehicle extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  plateNumber: string;

  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner?: IdentityUser;

  @Column({ type: 'uuid', nullable: true })
  ownerId?: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'varchar', length: 50 })
  type: VehicleType;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color?: string;

  @Column({ type: 'varchar', length: 50, default: VehicleStatus.AVAILABLE })
  status: VehicleStatus;

  @Column({ type: 'jsonb', nullable: true })
  capacity?: Record<string, number>;
}
