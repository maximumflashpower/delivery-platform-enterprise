import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EventCategory } from '../enums/event-category.enum';

@Entity('analytics_events')
export class AnalyticsEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'varchar', nullable: true })
  userId: string | null;

  @Column({ name: 'sessionId', type: 'varchar', length: 255, nullable: true })
  sessionId: string | null;

  @Column({ type: 'varchar', enum: EventCategory })
  category: EventCategory;

  @Column({ name: 'eventName', type: 'varchar', length: 255 })
  eventName: string;

  @Column({ type: 'text', nullable: true })
  properties: Record<string, any> | null;

  @Column({ name: 'deviceType', type: 'varchar', length: 50, nullable: true })
  deviceType: string | null;

  @Column({ name: 'platform', type: 'varchar', length: 50, nullable: true })
  platform: string | null;

  @Column({ name: 'ipAddress', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'userAgent', type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;
}
