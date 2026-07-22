import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('consents')
export class Consent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Index()
  @Column({ type: 'varchar' })
  purpose: string;

  @Column({ type: 'varchar', default: 'granted' })
  status: string;

  @Column({ type: 'varchar', default: 'web_form' })
  method: string;

  @Column({ type: 'varchar', nullable: true })
  version: string;

  @Column({ type: 'varchar', nullable: true })
  documentUrl: string;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'datetime', nullable: true })
  grantedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  revokedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date;

  @Column({ type: 'uuid', nullable: true })
  parentConsentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
