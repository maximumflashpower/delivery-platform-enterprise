import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CorrelationType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  CAUSAL = 'causal',
  SPURIOUS = 'spurious',
}

@Entity('risk_correlations')
export class RiskCorrelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  indicatorAId: string;

  @Column({ type: 'uuid' })
  indicatorBId: string;

  @Column({ type: 'float' })
  correlationCoefficient: number;

  @Column({ type: 'varchar', length: 50 })
  correlationType: CorrelationType;

  @Column({ type: 'float', nullable: true })
  confidenceScore: number;

  @Column({ type: 'text', nullable: true })
  analysis: string;

  @Column({ type: 'text', nullable: true })
  detectedByMethod: string;

  @Column({ type: 'datetime', nullable: true })
  analyzedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
