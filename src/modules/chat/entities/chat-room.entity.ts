import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ChatRoomType } from '../enums/chat-room-type.enum';

@Entity('chat_rooms')
export class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'roomName', type: 'varchar', length: '255', nullable: true })
  roomName: string | null;

  @Column({ type: 'enum', enum: ChatRoomType })
  type: ChatRoomType;

  @Column({ name: 'createdByUserId', type: 'uuid' })
  createdByUserId: string;

  @Column({ name: 'participantIds', type: 'jsonb' })
  participantIds: string[];

  @Column({ name: 'lastMessageAt', type: 'timestamp with time zone', nullable: true })
  lastMessageAt: Date | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
