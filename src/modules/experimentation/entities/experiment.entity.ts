import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ExperimentType } from '../enums/experiment-type.enum';
import { ExperimentStatus } from '../enums/experiment-status.enum';

@Entity('experiments')
export class Experiment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'experimentName', type: 'varchar', length: '255' })
  experimentName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', enum: ExperimentType })
  type: ExperimentType;

  @Column({ type: 'varchar', enum: ExperimentStatus, default: ExperimentStatus.DRAFT })
  status: ExperimentStatus;

  @Column({ name: 'startDate', type: 'datetime', nullable: true })
  startDate: Date | null;

  @Column({ name: 'endDate', type: 'datetime', nullable: true })
  endDate: Date | null;

  @Column({ name: 'createdByUserId', type: 'uuid', nullable: true })
  createdByUserId: string | null;

  @Column({ name: 'targetAudience', type: 'text', nullable: true })
  targetAudience: Record<string, any> | null;

  @Column({ name: 'primaryMetric', type: 'varchar', length: '100', nullable: true })
  primaryMetric: string | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
