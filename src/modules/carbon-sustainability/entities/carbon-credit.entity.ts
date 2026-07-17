import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { CarbonCreditType } from '../enums/carbon-credit-type.enum';

@Entity('carbon_credits')
export class CarbonCredit extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creditName', type: 'varchar', length: '255' })
  creditName: string;

  @Column({ type: 'enum', enum: CarbonCreditType })
  type: CarbonCreditType;

  @Column({ name: 'co2AmountKg', type: 'decimal', precision: 12, scale: 2 })
  co2AmountKg: number;

  @Column({ name: 'pricePerKg', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerKg: number | null;

  @Column({ name: 'currency', type: 'varchar', length: '10', default: "'USD'" })
  currency: string;

  @Column({ name: 'provider', type: 'varchar', length: '255', nullable: true })
  provider: string | null;

  @Column({ name: 'certificationId', type: 'varchar', length: '255', nullable: true })
  certificationId: string | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'expiryDate', type: 'date', nullable: true })
  expiryDate: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
