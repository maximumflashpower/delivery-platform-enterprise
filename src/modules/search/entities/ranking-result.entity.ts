import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('ranking_results')
export class RankingResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'model_id' })
  modelId: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('uuid', { name: 'entity_id' })
  entityId: string;

  @Column({ length: 100 })
  entity_type: string;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'float', default: 0 })
  collaborative_score: number;

  @Column({ type: 'float', default: 0 })
  content_score: number;

  @Column({ type: 'float', default: 0 })
  popularity_score: number;

  @Column({ type: 'float', default: 0 })
  recency_score: number;

  @Column({ type: 'float', default: 0 })
  personalization_score: number;

  @Column({ type: 'integer', default: 0 })
  rank_position: number;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  context_query: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;
}
