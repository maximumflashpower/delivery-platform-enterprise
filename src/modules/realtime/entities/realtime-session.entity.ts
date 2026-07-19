import { Entity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SessionState } from '../enums/session-state.enum';

@Entity('realtime_sessions')
export class RealtimeSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'varchar' })
  userId: string;

  @Column({ name: 'connectionId', type: 'varchar', length: '255', unique: true })
  connectionId: string;

  @Column({ type: 'varchar', enum: SessionState, default: SessionState.CONNECTED })
  state: SessionState;

  @Column({ name: 'channelId', type: 'varchar', nullable: true })
  channelId: string | null;

  @Column({ name: 'ipAddress', type: 'varchar', length: '45', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'userAgent', type: 'varchar', length: '500', nullable: true })
  userAgent: string | null;

  @Column({ name: 'lastHeartbeatAt', type: 'datetime', nullable: true })
  lastHeartbeatAt: Date | null;

  @Column({ name: 'disconnectedAt', type: 'datetime', nullable: true })
  disconnectedAt: Date | null;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
