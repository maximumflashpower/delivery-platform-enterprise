import { Entity, Column, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { NotificationChannel } from '../enums/notification-channel.enum';

@Entity('notification_preferences')
export class NotificationPreference extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'varchar', unique: true })
  userId: string;

  @Column({ name: 'channelType', type: 'varchar', enum: NotificationChannel, unique: true })
  channelType: NotificationChannel;

  @Column({ name: 'isEnabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ type: 'text', nullable: true })
  settings: Record<string, any> | null;

  @Column({ name: 'optedInAt', type: 'datetime', nullable: true })
  optedInAt: Date | null;

  @Column({ name: 'optedOutAt', type: 'datetime', nullable: true })
  optedOutAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
