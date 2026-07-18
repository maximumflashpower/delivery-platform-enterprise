import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RateLimitUnit } from '../enums/rate-limit-unit.enum';

@Entity('rate_limit_policies')
export class RateLimitPolicy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'policyName', type: 'varchar', length: 255 })
  policyName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'maxRequests', type: 'int' })
  maxRequests: number;

  @Column({ name: 'windowDuration', type: 'int' })
  windowDuration: number;

  @Column({ name: 'windowUnit', type: 'varchar', enum: RateLimitUnit })
  windowUnit: RateLimitUnit;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'ownerUserId', type: 'uuid', nullable: true })
  ownerUserId: string | null;

  @Column({ name: 'appliesTo', type: 'varchar', length: 100, nullable: true })
  appliesTo: string | null;

  @Column({ name: 'scope', type: 'varchar', length: 50, default: 'global' })
  scope: string;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
