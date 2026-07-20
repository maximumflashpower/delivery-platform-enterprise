import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum SignalType {
  VIEW = 'view',
  CLICK = 'click',
  SAVE = 'save',
  SHARE = 'share',
  PURCHASE = 'purchase',
  RATE = 'rate',
  DWELL_TIME = 'dwell_time',
  SEARCH_QUERY = 'search_query',
  BOOKMARK = 'bookmark',
  REVIEW = 'review'
}

export enum SignalSource {
  ORGANIC = 'organic',
  RECOMMENDED = 'recommended',
  SEARCH = 'search',
  PUSH = 'push',
  SOCIAL = 'social'
}

@Entity('interest_signals')
export class InterestSignal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('uuid', { name: 'entity_id' })
  entityId: string;

  @Column({ length: 100 })
  entity_type: string;

  @Column({ type: 'varchar', length: 50 })
  signal_type: SignalType;

  @Column({ type: 'varchar', length: 50, default: SignalSource.ORGANIC })
  signal_source: SignalSource;

  @Column({ type: 'float', default: 1.0 })
  weight: number;

  @Column({ type: 'text', nullable: true })
  context: string;

  @Column({ type: 'float', nullable: true })
  dwell_time_seconds: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rating_value: string;

  @Column({ type: 'text', nullable: true })
  search_query_text: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
