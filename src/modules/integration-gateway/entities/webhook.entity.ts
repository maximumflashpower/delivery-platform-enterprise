import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { WebhookEvent } from '../enums/webhook-event.enum';

@Entity('webhooks')
export class Webhook extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'endpointUrl', type: 'varchar', length: 500 })
  endpointUrl: string;

  @Column({ name: 'events', type: 'enum', enum: WebhookEvent, array: true })
  events: WebhookEvent[];

  @Column({ name: 'secret', type: 'varchar', length: 255, nullable: true })
  secret: string | null;

  @Column({ name: 'httpMethod', type: 'varchar', length: 10, default: 'POST' })
  httpMethod: string;

  @Column({ name: 'headers', type: 'jsonb', nullable: true })
  headers: Record<string, string> | null;

  @Column({ name: 'retryAttempts', type: 'int', default: 3 })
  retryAttempts: number;

  @Column({ name: 'timeoutMs', type: 'int', default: 5000 })
  timeoutMs: number;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'successCount', type: 'bigint', default: 0 })
  successCount: bigint;

  @Column({ name: 'failureCount', type: 'bigint', default: 0 })
  failureCount: bigint;

  @Column({ name: 'lastTriggeredAt', type: 'timestamp with time zone', nullable: true })
  lastTriggeredAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
