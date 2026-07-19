import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ChatRoomType } from '../enums/chat-room-type.enum';

@Entity('chat_rooms')
export class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'roomName', type: 'varchar', length: '255', nullable: true })
  roomName: string | null;

  @Column({ type: 'varchar', enum: ChatRoomType })
  type: ChatRoomType;

  @Column({ name: 'createdByUserId', type: 'varchar' })
  createdByUserId: string;

  @Column({ name: 'participantIds', type: 'text' })
  participantIds: string[];

  @Column({ name: 'lastMessageAt', type: 'datetime', nullable: true })
  lastMessageAt: Date | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
