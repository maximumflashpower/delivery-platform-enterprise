import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum IncidentStatus {
  DETECTED = 'detected',
  INVESTIGATING = 'investigating',
  MITIGATING = 'mitigating',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('risk_incidents')
export class RiskIncident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  incidentName: string;

  @Column({ type: 'uuid', nullable: true })
  triggerIndicatorId: string;

  @Column({ type: 'varchar', length: 50 })
  severity: string;

  @Column({ type: 'varchar', length: 50, default: IncidentStatus.DETECTED })
  status: IncidentStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  impactAssessment: string;

  @Column({ type: 'text', nullable: true })
  rootCause: string;

  @Column({ type: 'text', nullable: true })
  resolutionNotes: string;

  @Column({ type: 'uuid', nullable: true })
  assignedTo: string;

  @Column({ type: 'datetime', nullable: true })
  detectedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'json', nullable: true })
  affectedSystems: string[];

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
