import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

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

  @Column({ name: 'permissions', type: 'text' })
  permissions: string[];

  @Column({ name: 'allowedOrigins', type: 'text', nullable: true })
  allowedOrigins: string[] | null;

  @Column({ name: 'rateLimit', type: 'int', default: 1000 })
  rateLimit: number;

  @Column({ name: 'expiresAt', type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @Column({ name: 'lastUsedAt', type: 'datetime', nullable: true })
  lastUsedAt: Date | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
