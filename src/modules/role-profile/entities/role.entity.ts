import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('identity_roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  level: string;

  @Column({ type: 'text', array: true, default: '{}' })
  permissions: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
