import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('api_keys')
export class ApiKey extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'keyHash', type: 'varchar', length: 255, unique: true })
  keyHash: string;

  @Column({ name: 'keyPrefix', type: 'varchar', length: 16 })
  keyPrefix: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'permissions', type: 'jsonb' })
  permissions: string[];

  @Column({ name: 'allowedOrigins', type: 'jsonb', nullable: true })
  allowedOrigins: string[] | null;

  @Column({ name: 'rateLimit', type: 'int', default: 1000 })
  rateLimit: number;

  @Column({ name: 'expiresAt', type: 'timestamp with time zone', nullable: true })
  expiresAt: Date | null;

  @Column({ name: 'lastUsedAt', type: 'timestamp with time zone', nullable: true })
  lastUsedAt: Date | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
