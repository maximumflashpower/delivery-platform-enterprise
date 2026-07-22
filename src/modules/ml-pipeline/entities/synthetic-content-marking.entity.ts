import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('synthetic_content_markings')
export class SyntheticContentMarking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  contentId: string;

  @Column('varchar', { length: 100 })
  contentType: string;

  @Column('uuid')
  modelId: string;

  @Column('varchar', { length: 100 })
  modelName: string;

  @Column('varchar', { length: 50 })
  watermarkVersion: string;

  @Column('varchar', { length: 64 })
  watermarkHash: string;

  @Column('varchar', { length: 20, default: 'low' })
  riskLevel: string;

  @Column('float', { nullable: true })
  confidenceScore: number | null;

  @Column('text', { nullable: true })
  watermarkPayload: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  markedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  detectedAt: Date | null;

  @Column('varchar', { length: 20, default: 'active' })
  status: string;

  @Column('text', { nullable: true })
  metadata: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
