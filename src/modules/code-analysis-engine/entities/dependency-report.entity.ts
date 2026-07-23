import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

@Entity('code_analysis_dependencies')
export class DependencyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  scanId: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  packageName: string;

  @Column({ type: 'varchar', length: 50 })
  currentVersion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  latestVersion: string | null;

  @Column({ type: 'boolean', default: false })
  isOutdated: boolean;

  @Index()
  @Column({ type: 'varchar', length: 20, default: 'info' })
  severity: string;

  @Column({ type: 'text', nullable: true })
  knownCVEs: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  licenseType: string | null;

  @Column({ type: 'varchar', length: 20, default: 'dependencies' })
  dependencyType: string;

  @Index()
  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
