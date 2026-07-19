import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('webhook_deliveries')
export class WebhookDelivery extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'eventId', type: 'varchar' })
  eventId: string;

  @Column({ name: 'endpointId', type: 'varchar' })
  endpointId: string;

  @Column({ name: 'requestMethod', type: 'varchar', length: 10, default: 'POST' })
  requestMethod: string;

  @Column({ name: 'requestUrl', type: 'varchar', length: 1000 })
  requestUrl: string;

  @Column({ name: 'requestHeaders', type: 'text', nullable: true })
  requestHeaders: Record<string, string> | null;

  @Column({ name: 'requestBody', type: 'text', nullable: true })
  requestBody: Record<string, any> | null;

  @Column({ name: 'responseStatusCode', type: 'int', nullable: true })
  responseStatusCode: number | null;

  @Column({ name: 'responseHeaders', type: 'text', nullable: true })
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

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
