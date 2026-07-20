import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ExceptionType {
  POLICY_EXEMPTION = 'policy_exemption',
  ACCESS_OVERRIDE = 'access_override',
  COMPLIANCE_WAIVER = 'compliance_waiver',
  PROCESS_DEVIATION = 'process_deviation'
}

export enum ExceptionStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  DENIED = 'denied',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

@Entity('exception_records')
export class ExceptionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  exception_type: ExceptionType;

  @Column({ type: 'varchar', length: 50, default: ExceptionStatus.REQUESTED })
  status: ExceptionStatus;

  @Column({ type: 'text' })
  justification: string;

  @Column({ length: 255, nullable: true })
  policy_reference: string;

  @Column('uuid', { name: 'requested_by' })
  requestedBy: string;

  @Column('uuid', { name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ type: 'datetime', nullable: true })
  expires_at: Date;

  @Column({ type: 'text', nullable: true })
  conditions: string;

  @Column({ type: 'text', nullable: true })
  review_notes: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
