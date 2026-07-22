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
  @Column({ type: 'uuid' })
  userId: string;

  @Index()
  @Column({ type: 'varchar' })
  channel: string;

  @Column({ type: 'varchar' })
  communicationType: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
