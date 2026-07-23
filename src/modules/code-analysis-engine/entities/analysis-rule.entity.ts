import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

@Entity('code_analysis_rules')
export class AnalysisRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  ruleName: string;

  @Column({ type: 'varchar', length: 50, default: 'vulnerability' })
  ruleType: string;

  @Column({ type: 'text' })
  pattern: string;

  @Column({ type: 'varchar', length: 20, default: 'warning' })
  severity: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  isBuiltIn: boolean;

  @Column({ type: 'varchar', length: 50, default: 'all' })
  language: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cweId: string | null;

  @Column({ type: 'text', nullable: true })
  remediation: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
