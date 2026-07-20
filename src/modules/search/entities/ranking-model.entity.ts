import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum RankingStrategy {
  HYBRID = 'hybrid',
  COLLABORATIVE = 'collaborative',
  CONTENT_BASED = 'content_based',
  POPULARITY = 'popularity',
  PERSONALIZED = 'personalized',
  TRENDING = 'trending'
}

export enum ModelStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPERIMENTAL = 'experimental'
}

@Entity('ranking_models')
export class RankingModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  strategy: RankingStrategy;

  @Column({ type: 'varchar', length: 50, default: ModelStatus.DRAFT })
  status: ModelStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', default: 1.0 })
  weight_collaborative: number;

  @Column({ type: 'float', default: 1.0 })
  weight_content: number;

  @Column({ type: 'float', default: 1.0 })
  weight_popularity: number;

  @Column({ type: 'float', default: 1.0 })
  weight_recency: number;

  @Column({ type: 'float', default: 0.5 })
  weight_personalization: number;

  @Column({ type: 'text', nullable: true })
  ml_model_ref: string;

  @Column({ type: 'text', nullable: true })
  parameters: string;

  @Column('uuid', { name: 'ml_pipeline_model_id', nullable: true })
  mlPipelineModelId: string;

  @Column({ type: 'datetime', nullable: true })
  last_trained_at: Date;

  @Column({ type: 'float', nullable: true })
  accuracy_score: number;

  @Index()
  @Column({ length: 100, nullable: true })
  target_entity_type: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
