import { Entity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { SessionState } from '../enums/session-state.enum';

@Entity('realtime_sessions')
export class RealtimeSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'connectionId', type: 'varchar', length: '255', unique: true })
  connectionId: string;

  @Column({ type: 'enum', enum: SessionState, default: SessionState.CONNECTED })
  state: SessionState;

  @Column({ name: 'channelId', type: 'uuid', nullable: true })
  channelId: string | null;

  @Column({ name: 'ipAddress', type: 'varchar', length: '45', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'userAgent', type: 'varchar', length: '500', nullable: true })
  userAgent: string | null;

  @Column({ name: 'lastHeartbeatAt', type: 'timestamp with time zone', nullable: true })
  lastHeartbeatAt: Date | null;

  @Column({ name: 'disconnectedAt', type: 'timestamp with time zone', nullable: true })
  disconnectedAt: Date | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
