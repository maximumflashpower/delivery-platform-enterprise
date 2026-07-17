import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ChannelType } from '../enums/channel-type.enum';

@Entity('realtime_channels')
export class RealtimeChannel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'channelName', type: 'varchar', length: '255', unique: true })
  channelName: string;

  @Column({ type: 'enum', enum: ChannelType })
  type: ChannelType;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'creatorUserId', type: 'uuid', nullable: true })
  creatorUserId: string | null;

  @Column({ name: 'participantCount', type: 'int', default: 0 })
  participantCount: number;

  @Column({ name: 'settings', type: 'jsonb', nullable: true })
  settings: Record<string, any> | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'lastActivityAt', type: 'timestamp with time zone', nullable: true })
  lastActivityAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
