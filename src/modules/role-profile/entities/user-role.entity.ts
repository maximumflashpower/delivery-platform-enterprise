import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { Role } from './role.entity';

@Entity('identity_user_roles')
export class UserRole extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: IdentityUser;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'uuid' })
  roleId: string;

  @Column({ type: 'timestamp' })
  assignedAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  assignedBy?: string;
}
