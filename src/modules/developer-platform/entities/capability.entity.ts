import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('capabilities')
export class Capability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  capabilityKey: string;

  @Column()
  capabilityName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'system' })
  category: string;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @Column({ type: 'varchar', default: 'internal' })
  source: string;

  @Column({ type: 'varchar', nullable: true })
  sourceAuthorityId: string;

  @Column({ type: 'varchar', default: '1.0.0' })
  version: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isCritical: boolean;

  @Column({ type: 'varchar', nullable: true })
  ownerDomain: string;

  @Column({ type: 'text', nullable: true })
  dependencies: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
