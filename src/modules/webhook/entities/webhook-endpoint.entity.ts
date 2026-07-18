import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { WebhookEventType } from '../enums/webhook-event-type.enum';

@Entity('webhook_endpoints')
export class WebhookEndpoint extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'endpointName', type: 'varchar', length: 255 })
  endpointName: string;

  @Column({ name: 'targetUrl', type: 'varchar', length: 1000 })
  targetUrl: string;

  @Column({ type: 'text', nullable: true })
  subscribedEvents: WebhookEventType[] | null;

  @Column({ name: 'secretToken', type: 'varchar', length: 500, nullable: true })
  secretToken: string | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'ownerUserId', type: 'uuid' })
  ownerUserId: string;

  @Column({ name: 'retryMaxAttempts', type: 'int', default: 3 })
  retryMaxAttempts: number;

  @Column({ name: 'retryDelaySeconds', type: 'int', default: 60 })
  retryDelaySeconds: number;

  @Column({ name: 'lastTriggeredAt', type: 'datetime', nullable: true })
  lastTriggeredAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
