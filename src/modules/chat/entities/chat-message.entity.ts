import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { MessageStatus } from '../enums/message-status.enum';

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'roomId', type: 'uuid' })
  roomId: string;

  @Column({ name: 'senderId', type: 'uuid' })
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.SENT })
  status: MessageStatus;

  @Column({ name: 'attachments', type: 'jsonb', nullable: true })
  attachments: Record<string, any>[] | null;

  @Column({ name: 'replyToId', type: 'uuid', nullable: true })
  replyToId: string | null;

  @Column({ name: 'editedAt', type: 'timestamp with time zone', nullable: true })
  editedAt: Date | null;

  @Column({ name: 'readByUserIds', type: 'jsonb', nullable: true })
  readByUserIds: string[] | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
