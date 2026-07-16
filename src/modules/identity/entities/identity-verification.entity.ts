import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from './identity-user.entity';
import { VerificationStatus } from '../enums/verification-status.enum';
import { IdentityProvider } from '../enums/identity-provider.enum';

@Entity('identity_verifications')
export class IdentityVerification extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: IdentityUser;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  verificationType: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;

  @Column({ type: 'varchar', length: 50 })
  status: VerificationStatus;

  @Column({ type: 'varchar', length: 50 })
  provider: IdentityProvider;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token?: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;
}
