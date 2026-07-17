import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('external_services')
export class ExternalService extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serviceProvider', type: 'varchar', length: 100 })
  serviceProvider: string;

  @Column({ name: 'serviceName', type: 'varchar', length: 255 })
  serviceName: string;

  @Column({ name: 'apiKey', type: 'text', nullable: true })
  apiKey: string | null;

  @Column({ name: 'apiSecret', type: 'text', nullable: true })
  apiSecret: string | null;

  @Column({ name: 'baseUrl', type: 'varchar', length: 500 })
  baseUrl: string;

  @Column({ name: 'authType', type: 'varchar', length: 50, default: 'api_key' })
  authType: string;

  @Column({ name: 'webhookUrl', type: 'varchar', length: 500, nullable: true })
  webhookUrl: string | null;

  @Column({ name: 'isConfigured', type: 'boolean', default: false })
  isConfigured: boolean;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
