import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { ProviderStatus } from '../enums/provider-status.enum';
import { SkillLevel } from '../enums/skill-level.enum';

@Entity('domain_service_providers')
export class ServiceProvider extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: IdentityUser;

  @Column({ type: 'varchar', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  providerCode: string;

  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'varchar', length: 50, default: ProviderStatus.OFFLINE })
  status: ProviderStatus;

  @Column({ type: 'varchar', length: 50, default: SkillLevel.JUNIOR })
  skillLevel: SkillLevel;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  totalBookings: number;

  @Column({ type: 'text', nullable: true })
  serviceAreas?: string[];

  @Column({ type: 'text', nullable: true })
  categories?: string[];
}
