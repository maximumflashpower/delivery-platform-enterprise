import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('revenue_snapshots')
export class RevenueSnapshot extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  snapshotDate: Date;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 15, scale: 2 })
  totalRevenue: number;

  @Column({ name: 'orders_count', type: 'integer' })
  ordersCount: number;

  @Column({ name: 'avg_order_value', type: 'decimal', precision: 12, scale: 2, nullable: true })
  avgOrderValue: number | null;

  @Column({ name: 'by_domain', type: 'text' })
  byDomain: string; // JSON string

  @Column({ name: 'by_payment_method', type: 'text', nullable: true })
  byPaymentMethod: string | null; // JSON string

  @CreateDateColumn({ name: 'generated_at', type: 'datetime' })
  generatedAt: Date;
}
