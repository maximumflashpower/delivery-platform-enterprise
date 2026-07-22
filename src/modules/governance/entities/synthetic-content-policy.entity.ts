import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('synthetic_content_policies')
export class SyntheticContentPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  policyName: string;

  @Column('varchar', { length: 20, default: 'draft' })
  status: string;

  @Column('varchar', { length: 50, default: 'all' })
  applicableTo: string;

  @Column('varchar', { length: 20, default: 'mandatory' })
  requirementLevel: string;

  @Column('text', { nullable: true })
  riskThresholds: string;

  @Column('text', { nullable: true })
  allowedModels: string | null;

  @Column('text', { nullable: true })
  blockedModels: string | null;

  @Column('text', { nullable: true })
  rationale: string | null;

  @Column('uuid', { nullable: true })
  createdByUserId: string | null;

  @Column({ type: 'datetime', nullable: true })
  effectiveDate: Date | null;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
