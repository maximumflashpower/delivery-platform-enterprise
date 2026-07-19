import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { CredentialType } from '../enums/credential-type.enum';
import { CredentialStatus } from '../enums/credential-status.enum';

@Entity('credentials')
export class Credential extends BaseEntity {
  @OneToOne(() => IdentityUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: IdentityUser;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  type: CredentialType;

  @Column({ type: 'varchar', length: 255 })
  identifier: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  secretHash?: string;

  @Column({ type: 'varchar', length: 50, default: CredentialStatus.ACTIVE })
  status: CredentialStatus;

  @Column({ type: 'datetime', nullable: true })
  lastUsedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'int', default: 0 })
  failedAttempts: number;

  @Column({ type: 'datetime', nullable: true })
  lockedUntil?: Date;
}
