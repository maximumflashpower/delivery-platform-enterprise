import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EscrowStatus {
  INITIATED = 'initiated',
  FUNDED = 'funded',
  ACTIVE = 'active',
  MILESTONE_APPROVED = 'milestone_approved',
  PARTIALLY_RELEASED = 'partially_released',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded',
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISED = 'revised',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  CRYPTO = 'crypto',
  CREDIT_CARD = 'credit_card',
}

@Entity('milestone_escrows')
export class MilestoneEscrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  escrowName: string;

  @Column({ type: 'uuid' })
  sponsorId: string;

  @Column({ type: 'uuid' })
  recipientId: string;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: EscrowStatus.INITIATED })
  status: EscrowStatus;

  @Column({ type: 'json' })
  milestones: Record<string, any>[];

  @Column({ type: 'decimal', precision: 19, scale: 4, default: 0 })
  amountReleased: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, default: 0 })
  amountHeld: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, default: 0 })
  amountRefunded: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'uuid', nullable: true })
  disputeRaisedBy: string;

  @Column({ type: 'text', nullable: true })
  disputeReason: string;

  @Column({ type: 'datetime', nullable: true })
  fundedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  disputedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  managedBy: string;

  @Column({ type: 'text', nullable: true })
  termsAndConditions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
