import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { RateLimitUnit } from '../enums/rate-limit-unit.enum';

@Entity('rate_limit_buckets')
export class RateLimitBucket extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'policyId', type: 'uuid' })
  policyId: string;

  @Column({ name: 'identifier', type: 'varchar', length: 255 })
  identifier: string;

  @Column({ name: 'currentCount', type: 'int', default: 0 })
  currentCount: number;

  @Column({ name: 'resetAt', type: 'timestamp with time zone' })
  resetAt: Date;

  @Column({ name: 'unit', type: 'enum', enum: RateLimitUnit })
  unit: RateLimitUnit;

  @Column({ name: 'maxRequests', type: 'int' })
  maxRequests: number;

  @Column({ name: 'windowDuration', type: 'int' })
  windowDuration: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
