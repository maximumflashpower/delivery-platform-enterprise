import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum CostCalculationStatus {
  DRAFT = 'draft',
  CALCULATING = 'calculating',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum CostCategory {
  MATERIALS = 'materials',
  LABOR = 'labor',
  LOGISTICS = 'logistics',
  PACKAGING = 'packaging',
  OVERHEAD = 'overhead',
  MARKETING = 'marketing',
  FEES = 'fees',
  TAXES = 'taxes',
  MISCELLANEOUS = 'miscellaneous',
}

@Entity('production_cost_calculations')
export class ProductionCostCalculation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  productName: string;

  @Column({ type: 'text', nullable: true })
  productDescription: string | null;

  @Column({ type: 'uuid' })
  merchantId: string;

  @Column({ type: 'varchar', length: 50, default: CostCalculationStatus.DRAFT })
  status: CostCalculationStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalDirectMaterials: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalDirectLabor: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalLogistics: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalPackaging: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalOverhead: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalMarketing: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalFees: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalTaxes: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  grandTotal: number;

  @Column({ type: 'int', default: 1 })
  productionQuantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  costPerUnit: number;

  @Column({ type: 'varchar', length: 50, default: 'USD' })
  currency: string;

  @Column({ type: 'datetime', nullable: true })
  calculatedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  calculatedBy: string | null;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string | null;

  @Column({ type: 'datetime', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string | null;

  @Column({ type: 'text', nullable: true })
  reviewNotes: string | null;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ type: 'datetime', nullable: true })
  nextRecalculationDate: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;
}
