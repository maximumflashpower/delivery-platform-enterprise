import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RateLimitUnit } from '../enums/rate-limit-unit.enum';

@Entity('rate_limit_buckets')
export class RateLimitBucket extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'policyId', type: 'varchar' })
  policyId: string;

  @Column({ name: 'identifier', type: 'varchar', length: 255 })
  identifier: string;

  @Column({ name: 'currentCount', type: 'int', default: 0 })
  currentCount: number;

  @Column({ name: 'resetAt', type: 'datetime' })
  resetAt: Date;

  @Column({ name: 'unit', type: 'varchar', enum: RateLimitUnit })
  unit: RateLimitUnit;

  @Column({ name: 'maxRequests', type: 'int' })
  maxRequests: number;

  @Column({ name: 'windowDuration', type: 'int' })
  windowDuration: number;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
