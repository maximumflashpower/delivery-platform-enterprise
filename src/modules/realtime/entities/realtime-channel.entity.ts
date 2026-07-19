import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ChannelType } from '../enums/channel-type.enum';

@Entity('realtime_channels')
export class RealtimeChannel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'channelName', type: 'varchar', length: '255', unique: true })
  channelName: string;

  @Column({ type: 'varchar', enum: ChannelType })
  type: ChannelType;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'creatorUserId', type: 'varchar', nullable: true })
  creatorUserId: string | null;

  @Column({ name: 'participantCount', type: 'int', default: 0 })
  participantCount: number;

  @Column({ name: 'settings', type: 'text', nullable: true })
  settings: Record<string, any> | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'lastActivityAt', type: 'datetime', nullable: true })
  lastActivityAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
