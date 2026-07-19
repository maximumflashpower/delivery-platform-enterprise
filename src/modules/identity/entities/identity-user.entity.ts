import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { AccountStatus } from '../enums/account-status.enum';
import { IdentitySession } from './identity-session.entity';

@Entity('identity_users')
export class IdentityUser extends BaseEntity {
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  displayName: string;

  @Column({ type: 'varchar', length: 50, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @Column({ type: 'datetime', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  phoneVerifiedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  timezone?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  language?: string;

  @OneToMany(() => IdentitySession, session => session.user)
  sessions: IdentitySession[];
}
