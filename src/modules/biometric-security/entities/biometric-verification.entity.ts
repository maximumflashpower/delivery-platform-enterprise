import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { BiometricType } from '../enums/biometric-type.enum';
import { VerificationStatus } from '../enums/verification-status.enum';

@Entity('biometric_verifications')
export class BiometricVerification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'templateId', type: 'uuid', nullable: true })
  templateId: string | null;

  @Column({ type: 'enum', enum: BiometricType })
  type: BiometricType;

  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  status: VerificationStatus;

  @Column({ name: 'confidenceScore', type: 'decimal', precision: 5, scale: 4, nullable: true })
  confidenceScore: number | null;

  @Column({ name: 'ipAddress', type: 'varchar', length: '45', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'deviceId', type: 'varchar', length: '255', nullable: true })
  deviceId: string | null;

  @Column({ name: 'failureReason', type: 'text', nullable: true })
  failureReason: string | null;

  @Column({ name: 'verifiedAt', type: 'timestamp with time zone', nullable: true })
  verifiedAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
