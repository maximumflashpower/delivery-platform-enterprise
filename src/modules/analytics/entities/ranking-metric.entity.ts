import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

export enum MetricType {
  CTR = 'ctr',
  CONVERSION_RATE = 'conversion_rate',
  NDCG = 'ndcg',
  PRECISION_AT_K = 'precision_at_k',
  RECALL_AT_K = 'recall_at_k',
  MAP_SCORE = 'map_score',
  ENGAGEMENT_RATE = 'engagement_rate',
  DWELL_TIME = 'dwell_time',
  USER_SATISFACTION = 'user_satisfaction'
}

@Entity('ranking_metrics')
export class RankingMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'model_id' })
  modelId: string;

  @Column({ type: 'varchar', length: 50 })
  metric_type: MetricType;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'float', nullable: true })
  previous_value: number;

  @Column({ type: 'float', default: 0 })
  delta: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  time_window: string;

  @Column({ type: 'integer', nullable: true })
  sample_size: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;
}
