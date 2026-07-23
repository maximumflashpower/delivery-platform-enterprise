import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

@Entity('code_analysis_malicious_code')
export class MaliciousCodeFinding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  scanId: string;

  @Column({ type: 'varchar', length: 500 })
  filePath: string;

  @Column({ type: 'int', default: 0 })
  lineNumber: number;

  @Column({ type: 'varchar', length: 50, default: 'eval_usage' })
  threatType: string;

  @Column({ type: 'text' })
  description: string;

  @Index()
  @Column({ type: 'varchar', length: 20, default: 'high' })
  severity: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  patternMatched: string | null;

  @Column({ type: 'text', nullable: true })
  snippet: string | null;

  @Index()
  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
