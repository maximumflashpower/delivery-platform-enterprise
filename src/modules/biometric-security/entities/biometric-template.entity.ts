import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { BiometricType } from '../enums/biometric-type.enum';

@Entity('biometric_templates')
export class BiometricTemplate extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: BiometricType })
  type: BiometricType;

  @Column({ name: 'templateHash', type: 'varchar', length: '1000' })
  templateHash: string;

  @Column({ name: 'deviceId', type: 'varchar', length: '255', nullable: true })
  deviceId: string | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'lastUsedAt', type: 'timestamp with time zone', nullable: true })
  lastUsedAt: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
