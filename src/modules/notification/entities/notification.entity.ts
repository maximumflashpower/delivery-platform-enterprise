import { Entity, Column, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationChannel } from '../enums/notification-channel.enum';
import { NotificationTemplate } from './notification-template.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'varchar' })
  userId: string;

  @Column({ name: 'templateId', type: 'varchar', nullable: true })
  templateId: string | null;

  @ManyToOne(() => NotificationTemplate, { nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: NotificationTemplate | null;

  @Column({ type: 'varchar', enum: NotificationType, default: NotificationType.INFO })
  type: NotificationType;

  @Column({ type: 'varchar', enum: NotificationChannel, default: NotificationChannel.IN_APP })
  channel: NotificationChannel;

  @Column({ type: 'varchar', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'scheduledAt', type: 'datetime', nullable: true })
  scheduledAt: Date | null;

  @Column({ name: 'sentAt', type: 'datetime', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'deliveredAt', type: 'datetime', nullable: true })
  deliveredAt: Date | null;

  @Column({ name: 'readAt', type: 'datetime', nullable: true })
  readAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
