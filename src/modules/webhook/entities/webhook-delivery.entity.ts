import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('webhook_deliveries')
export class WebhookDelivery extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'eventId', type: 'uuid' })
  eventId: string;

  @Column({ name: 'endpointId', type: 'uuid' })
  endpointId: string;

  @Column({ name: 'requestMethod', type: 'varchar', length: 10, default: 'POST' })
  requestMethod: string;

  @Column({ name: 'requestUrl', type: 'varchar', length: 1000 })
  requestUrl: string;

  @Column({ name: 'requestHeaders', type: 'jsonb', nullable: true })
  requestHeaders: Record<string, string> | null;

  @Column({ name: 'requestBody', type: 'jsonb', nullable: true })
  requestBody: Record<string, any> | null;

  @Column({ name: 'responseStatusCode', type: 'int', nullable: true })
  responseStatusCode: number | null;

  @Column({ name: 'responseHeaders', type: 'jsonb', nullable: true })
  responseHeaders: Record<string, string> | null;

  @Column({ name: 'responseBody', type: 'text', nullable: true })
  responseBody: string | null;

  @Column({ name: 'durationMs', type: 'int', nullable: true })
  durationMs: number | null;

  @Column({ name: 'isSuccess', type: 'boolean', default: false })
  isSuccess: boolean;

  @Column({ name: 'errorMessage', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'attemptNumber', type: 'int' })
  attemptNumber: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
