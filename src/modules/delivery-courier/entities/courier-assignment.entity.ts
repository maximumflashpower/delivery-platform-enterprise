import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Courier } from './courier.entity';
import { AssignmentStatus } from '../enums/assignment-status.enum';

@Entity('domain_courier_assignments')
export class CourierAssignment extends BaseEntity {
  @ManyToOne(() => Courier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courierId' })
  courier: Courier;

  @Column({ type: 'uuid' })
  courierId: string;

  @Column({ type: 'uuid', nullable: true })
  rideId?: string;

  @Column({ type: 'uuid', nullable: true })
  routeId?: string;

  @Column({ type: 'varchar', length: 50, default: AssignmentStatus.ASSIGNED })
  status: AssignmentStatus;

  @Column({ type: 'datetime', nullable: true })
  assignedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt?: Date;
}
