import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('source_authorities')
export class SourceAuthority {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  authorityKey: string;

  @Column()
  authorityName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'official' })
  authorityType: string;

  @Column({ type: 'varchar', default: 'verified' })
  verificationStatus: string;

  @Column({ type: 'varchar', nullable: true })
  endpointUrl: string;

  @Column({ type: 'varchar', nullable: true })
  apiKeyRef: string;

  @Column({ type: 'varchar', nullable: true })
  certificateFingerprint: string;

  @Column({ type: 'varchar', default: '1.0.0' })
  version: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', default: 'system' })
  trustLevel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
