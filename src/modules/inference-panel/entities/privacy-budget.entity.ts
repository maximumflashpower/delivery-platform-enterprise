import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('privacy_budgets')
export class PrivacyBudget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', default: 'monthly' })
  period: string;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @Column({ type: 'int', default: 1000 })
  totalCredits: number;

  @Column({ type: 'int', default: 0 })
  consumedCredits: number;

  @Column({ type: 'int', default: 0 })
  refundedCredits: number;

  @Column({ type: 'datetime', nullable: true })
  periodStart: Date;

  @Column({ type: 'datetime', nullable: true })
  periodEnd: Date;

  @Column({ type: 'float', default: 0.01 })
  epsilonPerInference: number;

  @Column({ type: 'float', default: 1.0 })
  maxEpsilon: number;

  @Column({ type: 'float', default: 0 })
  consumedEpsilon: number;

  @Column({ type: 'json', nullable: true })
  config: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
