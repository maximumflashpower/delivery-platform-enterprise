import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { WebhookEventType } from '../enums/webhook-event-type.enum';
import { WebhookStatus } from '../enums/webhook-status.enum';

@Entity('webhook_events')
export class WebhookEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'endpointId', type: 'uuid' })
  endpointId: string;

  @Column({ type: 'enum', enum: WebhookEventType })
  eventType: WebhookEventType;

  @Column({ type: 'enum', enum: WebhookStatus, default: WebhookStatus.PENDING })
  status: WebhookStatus;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, any> | null;

  @Column({ name: 'attemptCount', type: 'int', default: 0 })
  attemptCount: number;

  @Column({ name: 'maxAttempts', type: 'int', default: 3 })
  maxAttempts: number;

  @Column({ name: 'nextRetryAt', type: 'timestamp with time zone', nullable: true })
  nextRetryAt: Date | null;

  @Column({ name: 'triggeredAt', type: 'timestamp with time zone' })
  triggeredAt: Date;

  @Column({ name: 'sentAt', type: 'timestamp with time zone', nullable: true })
  sentAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
