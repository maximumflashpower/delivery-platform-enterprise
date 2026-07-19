import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { ProfileType } from '../enums/profile-type.enum';
import { ProfileStatus } from '../enums/profile-status.enum';

@Entity('user_profiles')
export class Profile extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: IdentityUser;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', length: 50, default: ProfileType.INDIVIDUAL })
  type: ProfileType;

  @Column({ type: 'varchar', length: 50, default: ProfileStatus.ACTIVE })
  status: ProfileStatus;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  metadata?: Record<string, unknown>;
}
