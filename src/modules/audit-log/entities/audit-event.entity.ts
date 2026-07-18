import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { AuditEntityType } from '../enums/audit-entity-type.enum';

@Entity('audit_events')
export class AuditEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'eventName', type: 'varchar', length: 255 })
  eventName: string;

  @Column({ type: 'varchar', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'varchar', enum: AuditEntityType })
  entityType: AuditEntityType;

  @Column({ name: 'triggerUserId', type: 'uuid', nullable: true })
  triggerUserId: string | null;

  @Column({ name: 'webhookUrl', type: 'varchar', length: 500, nullable: true })
  webhookUrl: string | null;

  @Column({ name: 'isProcessed', type: 'boolean', default: false })
  isProcessed: boolean;

  @Column({ name: 'processedAt', type: 'datetime', nullable: true })
  processedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  payload: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
