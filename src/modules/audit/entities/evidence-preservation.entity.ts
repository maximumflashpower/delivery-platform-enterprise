import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EvidenceType {
  DIGITAL_RECORD = 'digital_record',
  COMMUNICATION_LOG = 'communication_log',
  TRANSACTION_RECORD = 'transaction_record',
  USER_DATA_SNAPSHOT = 'user_data_snapshot',
  SYSTEM_LOG = 'system_log',
  MEDIA_FILE = 'media_file',
  METADATA_PACKAGE = 'metadata_package',
}

export enum PreservationStatus {
  PENDING = 'pending',
  COLLECTING = 'collecting',
  SEALED = 'sealed',
  CHAIN_OF_CUSTODY_VERIFIED = 'chain_verified',
  RELEASED = 'released',
  PURGED = 'purged',
}

export enum SeverityLevel {
  STANDARD = 'standard',
  ELEVATED = 'elevated',
  CRITICAL = 'critical',
  LEGAL_HOLD = 'legal_hold',
}

@Entity('evidence_preservations')
export class EvidencePreservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  caseName: string;

  @Column({ type: 'varchar', length: 50 })
  evidenceType: EvidenceType;

  @Column({ type: 'varchar', length: 50, default: PreservationStatus.PENDING })
  status: PreservationStatus;

  @Column({ type: 'varchar', length: 50, default: SeverityLevel.STANDARD })
  severity: SeverityLevel;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  relatedEntityType: string;

  @Column({ type: 'json', nullable: true })
  evidenceData: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  storageLocation: string;

  @Column({ type: 'varchar', nullable: true })
  hashChecksum: string;

  @Column({ type: 'uuid', nullable: true })
  preservedBy: string;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;

  @Column({ type: 'text', nullable: true })
  chainOfCustodyNotes: string;

  @Column({ type: 'datetime', nullable: true })
  sealedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  releasedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  purgeScheduledAt: Date;

  @Column({ type: 'integer', default: 0 })
  accessCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
