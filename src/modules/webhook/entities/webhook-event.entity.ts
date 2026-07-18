import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { WebhookEventType } from '../enums/webhook-event-type.enum';
import { WebhookStatus } from '../enums/webhook-status.enum';

@Entity('webhook_events')
export class WebhookEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'endpointId', type: 'uuid' })
  endpointId: string;

  @Column({ type: 'varchar', enum: WebhookEventType })
  eventType: WebhookEventType;

  @Column({ type: 'varchar', enum: WebhookStatus, default: WebhookStatus.PENDING })
  status: WebhookStatus;

  @Column({ type: 'text', nullable: true })
  payload: Record<string, any> | null;

  @Column({ name: 'attemptCount', type: 'int', default: 0 })
  attemptCount: number;

  @Column({ name: 'maxAttempts', type: 'int', default: 3 })
  maxAttempts: number;

  @Column({ name: 'nextRetryAt', type: 'datetime', nullable: true })
  nextRetryAt: Date | null;

  @Column({ name: 'triggeredAt', type: 'datetime' })
  triggeredAt: Date;

  @Column({ name: 'sentAt', type: 'datetime', nullable: true })
  sentAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
