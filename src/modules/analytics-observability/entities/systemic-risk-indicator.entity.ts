import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum IndicatorCategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  SECURITY = 'security',
  COMPLIANCE = 'compliance',
  REPUTATION = 'reputation',
  PLATFORM = 'platform',
}

export enum IndicatorSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IndicatorTrend {
  IMPROVING = 'improving',
  STABLE = 'stable',
  WORSENING = 'worsening',
  VOLATILE = 'volatile',
}

export enum IndicatorStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  ARCHIVED = 'archived',
}

@Entity('systemic_risk_indicators')
export class SystemicRiskIndicator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  indicatorName: string;

  @Column({ type: 'varchar', length: 50 })
  category: IndicatorCategory;

  @Column({ type: 'varchar', length: 50 })
  severity: IndicatorSeverity;

  @Column({ type: 'varchar', length: 50, default: IndicatorTrend.STABLE })
  trend: IndicatorTrend;

  @Column({ type: 'varchar', length: 50, default: IndicatorStatus.ACTIVE })
  status: IndicatorStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', default: 0 })
  currentValue: number;

  @Column({ type: 'float', nullable: true })
  thresholdValue: number;

  @Column({ type: 'float', nullable: true })
  previousValue: number;

  @Column({ type: 'varchar', nullable: true })
  unit: string;

  @Column({ type: 'text', nullable: true })
  sourceSystem: string;

  @Column({ type: 'datetime', nullable: true })
  lastMeasuredAt: Date;

  @Column({ type: 'text', nullable: true })
  mitigationPlan: string;

  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
