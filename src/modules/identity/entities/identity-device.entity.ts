import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from './identity-user.entity';

@Entity('identity_devices')
export class IdentityDevice extends BaseEntity {
  @ManyToOne(() => IdentityUser, user => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: IdentityUser;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  deviceId: string;

  @Column({ type: 'varchar', length: 100 })
  deviceType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceName?: string;

  @Column({ type: 'boolean', default: true })
  isTrusted: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastUsedAt?: Date;
}
