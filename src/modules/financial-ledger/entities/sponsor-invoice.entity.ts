import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  PENDING_REVIEW = 'pending_review',
  NON_COMPLIANT = 'non_compliant',
  UNDER_INVESTIGATION = 'under_investigation',
  EXEMPT = 'exempt',
}

@Entity('sponsor_invoices')
export class SponsorInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  invoiceNumber: string;

  @Column({ type: 'uuid' })
  sponsorId: string;

  @Column({ type: 'varchar', length: 255 })
  sponsorName: string;

  @Column({ type: 'uuid', nullable: true })
  merchantId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  merchantName: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ type: 'varchar', length: 50, default: ComplianceStatus.PENDING_REVIEW })
  complianceStatus: ComplianceStatus;

  @Column({ type: 'json', nullable: true })
  lineItems: Record<string, any>[];

  @Column({ type: 'json', nullable: true })
  complianceChecks: Record<string, any>[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date', nullable: true })
  sentAt: Date;

  @Column({ type: 'date', nullable: true })
  paidAt: Date;

  @Column({ type: 'date', nullable: true })
  disputedAt: Date;

  @Column({ type: 'text', nullable: true })
  disputeReason: string;

  @Column({ type: 'date', nullable: true })
  compliantAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
