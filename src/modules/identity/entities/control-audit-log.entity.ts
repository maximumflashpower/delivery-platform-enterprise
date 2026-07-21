import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('identity_control_audit_logs')
export class ControlAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  controlId: string;

  @Column('uuid')
  userId: string;

  @Column({ length: 50 })
  action: 'created' | 'updated' | 'enabled' | 'disabled' | 'expired' | 'revoked';

  @Column('text', { nullable: true })
  previousValue: string | null;

  @Column('text', { nullable: true })
  newValue: string | null;

  @Column('uuid', { nullable: true })
  performedBy: string | null;

  @Column({ length: 100, nullable: true })
  source: string;

  @Column('text', { nullable: true })
  metadata: string;

  @CreateDateColumn()
  createdAt: Date;
}
