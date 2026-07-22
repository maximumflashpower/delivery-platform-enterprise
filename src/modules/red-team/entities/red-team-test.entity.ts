import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('red_team_tests')
export class RedTeamTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'model_id', type: 'varchar', length: 36 })
  modelId: string;

  @Column({ name: 'model_name', type: 'varchar', length: 200 })
  modelName: string;

  @Column({ name: 'attack_vector', type: 'varchar', length: 50 })
  attackVector: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ name: 'severity', type: 'varchar', length: 20, default: 'info' })
  severity: string;

  @Column({ name: 'prompt', type: 'text' })
  prompt: string;

  @Column({ name: 'expected_behavior', type: 'text', nullable: true })
  expectedBehavior: string | null;

  @Column({ name: 'actual_response', type: 'text', nullable: true })
  actualResponse: string | null;

  @Column({ name: 'passed', type: 'boolean', default: false })
  passed: boolean;

  @Column({ name: 'auto_remediate', type: 'boolean', default: false })
  autoRemediate: boolean;

  @Column({ name: 'remediation_status', type: 'varchar', length: 20, nullable: true })
  remediationStatus: string | null;

  @Column({ name: 'remediation_notes', type: 'text', nullable: true })
  remediationNotes: string | null;

  @Column({ name: 'metadata', type: 'text', nullable: true })
  metadata: string | null;

  @Column({ name: 'executed_by', type: 'varchar', length: 36 })
  executedBy: string;

  @Column({ name: 'started_at', type: 'datetime', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
