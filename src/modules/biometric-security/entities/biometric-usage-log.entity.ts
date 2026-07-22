import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('biometric_usage_logs')
export class BiometricUsageLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  consentId: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 20 })
  biometricType: string;

  @Column('varchar', { length: 100 })
  operationType: string;

  @Column('uuid')
  modelId: string;

  @Column('varchar', { length: 100 })
  modelName: string;

  @Column('varchar', { length: 50, default: 'approved' })
  approvalStatus: string;

  @Column('uuid', { nullable: true })
  approvedByUserId: string | null;

  @Column('text', { nullable: true })
  rejectionReason: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  usageTimestamp: Date;

  @Column('text', { nullable: true })
  additionalMetadata: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
