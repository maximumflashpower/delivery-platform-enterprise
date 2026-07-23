import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  userId: string;

  @Index()
  @Column({ type: 'varchar' })
  channel: string;

  @Column({ type: 'varchar' })
  communicationType: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  // Legacy column kept for backward compatibility - nullable to avoid constraint errors
  @Column({ type: 'varchar', nullable: true })
  channelType?: string;

  @Column({ type: 'varchar', nullable: true })
  recipient: string;

  @Column({ type: 'varchar', nullable: true })
  frequency: string;

  @Column({ type: 'datetime', nullable: true })
  quietStartTime: Date;

  @Column({ type: 'datetime', nullable: true })
  quietEndTime: Date;

  @Column({ type: 'json', nullable: true })
  settings: Record<string, any> | null;

  // Legacy columns for compatibility
  @Column({ type: 'boolean', default: true, name: 'is_enabled' })
  isEnabled?: boolean;

  @Column({ type: 'datetime', nullable: true })
  optedInAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  optedOutAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
