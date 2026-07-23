import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

@Entity('code_analysis_scan_jobs')
export class ScanJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 50, default: 'full_project' })
  targetType: string;

  @Column({ type: 'varchar', length: 500, default: 'src/' })
  targetPath: string;

  @Index()
  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  triggeredBy: string | null;

  @Column({ type: 'int', default: 0 })
  totalFindings: number;

  @Column({ type: 'text', nullable: true })
  findingsBySeverity: string | null;

  @Column({ type: 'text', nullable: true })
  findingsByType: string | null;

  @Column({ type: 'int', nullable: true })
  scanDurationMs: number | null;

  @Column({ type: 'int', default: 0 })
  filesScanned: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
