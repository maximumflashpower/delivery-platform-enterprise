import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ConsentType {
  DATA_PROCESSING = 'data_processing',
  MARKETING = 'marketing',
  THIRD_PARTY_SHARING = 'third_party_sharing',
  ANALYTICS = 'analytics',
  COOKIES = 'cookies',
  BIOMETRIC = 'biometric',
  LOCATION_TRACKING = 'location_tracking'
}

export enum ConsentStatus {
  GRANTED = 'granted',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

@Entity('privacy_consents')
export class PrivacyConsent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  consent_type: ConsentType;

  @Column({ type: 'varchar', length: 50 })
  status: ConsentStatus;

  @Column({ type: 'text', nullable: true })
  purpose_description: string;

  @Column({ type: 'text', nullable: true })
  legal_basis: string;

  @Column('uuid', { name: 'processor_id', nullable: true })
  processorId: string;

  @Column({ type: 'datetime', nullable: true })
  granted_at: Date;

  @Column({ type: 'datetime', nullable: true })
  withdrawn_at: Date;

  @Column({ type: 'datetime', nullable: true })
  expires_at: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  version: string;

  @Column({ type: 'text', nullable: true })
  withdrawal_reason: string | null;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
