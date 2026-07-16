import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from './identity-user.entity';
import { RecoveryMethod } from '../enums/recovery-method.enum';

@Entity('identity_recovery_codes')
export class IdentityRecoveryCode extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: IdentityUser;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  codeHash: string;

  @Column({ type: 'varchar', length: 50 })
  method: RecoveryMethod;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;
}
