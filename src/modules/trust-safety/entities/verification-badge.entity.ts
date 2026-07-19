import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { VerificationLevel } from '../enums/verification-level.enum';

@Entity('trust_verification_badges')
export class VerificationBadge extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: IdentityUser;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  badgeType: string;

  @Column({ type: 'varchar', length: 50 })
  level: VerificationLevel;

  @Column({ type: 'datetime' })
  awardedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  awardedReason?: string;
}
