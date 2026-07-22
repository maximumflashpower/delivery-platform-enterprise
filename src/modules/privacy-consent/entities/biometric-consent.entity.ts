import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('biometric_consents')
export class BiometricConsent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 20 })
  biometricType: string;

  @Column('varchar', { length: 50, default: 'given' })
  status: string;

  @Column('text', { nullable: true })
  consentText: string | null;

  @Column('varchar', { length: 100, default: 'self_upload' })
  captureMethod: string;

  @Column('varchar', { length: 100, default: 'production' })
  usageContext: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  capturedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @Column('varchar', { length: 100, default: 'none' })
  retentionPeriod: string;

  @Column('text', { nullable: true })
  purposeDescription: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
