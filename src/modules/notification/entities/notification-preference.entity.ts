import { Entity, Column, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { NotificationChannel } from '../enums/notification-channel.enum';

@Entity('notification_preferences')
export class NotificationPreference extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid', unique: true })
  userId: string;

  @Column({ name: 'channelType', type: 'enum', enum: NotificationChannel, unique: true })
  channelType: NotificationChannel;

  @Column({ name: 'isEnabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any> | null;

  @Column({ name: 'optedInAt', type: 'timestamp with time zone', nullable: true })
  optedInAt: Date | null;

  @Column({ name: 'optedOutAt', type: 'timestamp with time zone', nullable: true })
  optedOutAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
