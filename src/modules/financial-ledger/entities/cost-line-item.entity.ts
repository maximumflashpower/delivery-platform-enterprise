import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ProductionCostCalculation } from './production-cost-calculation.entity';
import { CostCategory } from './production-cost-calculation.entity';

@Entity('cost_line_items')
export class CostLineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  calculationId: string;

  @ManyToOne(() => ProductionCostCalculation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'calculationId' })
  calculation: ProductionCostCalculation;

  @Column({ type: 'varchar', length: 200 })
  itemName: string;

  @Column({ type: 'text', nullable: true })
  itemDescription: string | null;

  @Column({ type: 'varchar', length: 50 })
  category: CostCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitCost: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxPercent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalWithDiscountAndTax: number;

  @Column({ type: 'varchar', length: 50, default: 'UNIT' })
  unitOfMeasure: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  vendorSupplier: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  costType: string | null;

  @Column({ type: 'datetime', nullable: true })
  validFrom: Date | null;

  @Column({ type: 'datetime', nullable: true })
  validUntil: Date | null;

  @Column({ type: 'datetime', nullable: true })
  lastVerifiedAt: Date | null;

  @Column({ type: 'int', default: 1 })
  revisionNumber: number;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  effectiveDate: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @BeforeInsert()
  calculateTotalsOnInsert() {
    this.calculateTotals();
  }

  @BeforeUpdate()
  calculateTotalsOnUpdate() {
    this.calculateTotals();
  }

  private calculateTotals() {
    this.subtotal = this.unitCost * this.quantity;
    const afterDiscount = this.subtotal * (1 - this.discountPercent / 100);
    this.totalWithDiscountAndTax = afterDiscount * (1 + this.taxPercent / 100);
  }
}
