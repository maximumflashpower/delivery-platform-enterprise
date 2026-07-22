import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PrivacyBudget } from './privacy-budget.entity';

@Entity('privacy_budget_transactions')
export class PrivacyBudgetTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  budgetId: string;

  @ManyToOne(() => PrivacyBudget, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'budgetId' })
  budget: PrivacyBudget;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', default: 'consumption' })
  transactionType: string;

  @Column({ type: 'int', default: 1 })
  creditsAmount: number;

  @Column({ type: 'float', default: 0 })
  epsilonAmount: number;

  @Column({ type: 'uuid', nullable: true })
  inferenceLogId: string;

  @Column({ type: 'varchar', nullable: true })
  reason: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
