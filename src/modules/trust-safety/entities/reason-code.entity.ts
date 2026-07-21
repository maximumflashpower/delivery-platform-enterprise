import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('trust_safety_reason_codes')
export class ReasonCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 50, default: 'low' })
  severity: 'low' | 'medium' | 'high' | 'critical';

  @Column({ length: 50, default: 'auto' })
  autoAction: 'none' | 'flag_for_review' | 'auto_remove' | 'auto_warning' | 'auto_ban';

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  guidelines: string;

  @Column('text', { nullable: true })
  escalationPath: string;

  @Column({ type: 'int', default: 10 })
  priorityWeight: number;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
