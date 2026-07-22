import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('red_team_findings')
export class RedTeamFinding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'test_id', type: 'varchar', length: 36 })
  testId: string;

  @Column({ name: 'model_id', type: 'varchar', length: 36 })
  modelId: string;

  @Column({ name: 'finding_type', type: 'varchar', length: 50 })
  findingType: string;

  @Column({ name: 'severity', type: 'varchar', length: 20 })
  severity: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'evidence', type: 'text', nullable: true })
  evidence: string | null;

  @Column({ name: 'is_resolved', type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ name: 'resolved_at', type: 'datetime', nullable: true })
  resolvedAt: Date | null;

  @Column({ name: 'resolution_notes', type: 'text', nullable: true })
  resolutionNotes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
