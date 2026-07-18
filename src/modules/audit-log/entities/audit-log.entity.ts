import { Entity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { AuditEntityType } from '../enums/audit-entity-type.enum';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'actorUserId', type: 'uuid' })
  actorUserId: string;

  @Column({ name: 'actorIpAddress', type: 'varchar', length: 45, nullable: true })
  actorIpAddress: string | null;

  @Column({ type: 'varchar', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'varchar', enum: AuditEntityType })
  entityType: AuditEntityType;

  @Column({ name: 'entityId', type: 'uuid', nullable: true })
  entityId: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  oldValues: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  newValues: Record<string, any> | null;

  @Column({ name: 'userAgent', type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
