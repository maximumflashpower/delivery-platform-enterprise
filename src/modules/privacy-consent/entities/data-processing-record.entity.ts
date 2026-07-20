import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

export enum ProcessingPurpose {
  SERVICE_DELIVERY = 'service_delivery',
  CUSTOMER_SUPPORT = 'customer_support',
  MARKETING_COMMUNICATION = 'marketing_communication',
  ANALYTICS_IMPROVEMENT = 'analytics_improvement',
  COMPLIANCE_LEGAL = 'compliance_legal',
  SECURITY_FRAUD = 'security_fraud'
}

@Entity('data_processing_records')
export class DataProcessingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  processing_purpose: ProcessingPurpose;

  @Column({ length: 255 })
  data_category: string;

  @Column({ type: 'text', nullable: true })
  data_elements: string;

  @Column({ type: 'text', nullable: true })
  retention_policy: string;

  @Column('uuid', { name: 'consent_id', nullable: true })
  consentId: string;

  @Column({ type: 'datetime', name: 'processing_started_at' })
  processingStartedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  processing_ended_at: Date;

  @Column({ length: 255, nullable: true })
  legal_ground: string;

  @Column({ type: 'text', nullable: true })
  third_party_shares: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;
}
