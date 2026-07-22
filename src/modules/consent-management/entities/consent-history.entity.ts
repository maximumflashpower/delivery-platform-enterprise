import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('consent_history')
export class ConsentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  consentId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  purpose: string;

  @Column({ type: 'varchar' })
  previousStatus: string;

  @Column({ type: 'varchar' })
  newStatus: string;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'varchar', default: 'web_form' })
  method: string;

  @Column({ type: 'varchar', nullable: true })
  reason: string;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'varchar', nullable: true })
  performedBy: string;

  @CreateDateColumn()
  timestamp: Date;
}
