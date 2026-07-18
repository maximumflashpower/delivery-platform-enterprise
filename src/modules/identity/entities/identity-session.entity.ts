import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from './identity-user.entity';

@Entity('identity_sessions')
export class IdentitySession extends BaseEntity {
  @ManyToOne(() => IdentityUser, user => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: IdentityUser;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  refreshTokenHash: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar' })
  ipAddress: string;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  revokedAt?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  revokeReason?: string;
}
