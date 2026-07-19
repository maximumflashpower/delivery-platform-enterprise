import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('rate_limit_configs')
export class RateLimitConfig extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'identifier', type: 'varchar', length: 255 })
  identifier: string;

  @Column({ name: 'identifierType', type: 'varchar', length: 50, default: 'ip' })
  identifierType: string;

  @Column({ name: 'requestsPerSecond', type: 'int', default: 10 })
  requestsPerSecond: number;

  @Column({ name: 'burstLimit', type: 'int', default: 50 })
  burstLimit: number;

  @Column({ name: 'windowSeconds', type: 'int', default: 60 })
  windowSeconds: number;

  @Column({ name: 'maxRequestsInWindow', type: 'int', default: 1000 })
  maxRequestsInWindow: number;

  @Column({ name: 'scope', type: 'varchar', length: 100, default: 'global' })
  scope: string;

  @Column({ name: 'bypassList', type: 'text', nullable: true })
  bypassList: string[] | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
