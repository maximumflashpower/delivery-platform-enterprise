import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ReleaseGate } from '../../feature-flag/entities/release-gate.entity';

export enum OwnerRole {
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  COMPLIANCE = 'compliance',
  SECURITY = 'security'
}

@Entity('domain_owners')
export class DomainOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, unique: true })
  domain: string;

  @Column({ type: 'varchar', length: 50 })
  role: OwnerRole;

  @Column({ length: 255, nullable: true })
  contact_email: string;

  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ length: 255, nullable: true })
  escalation_contact: string;

  @OneToMany(() => ReleaseGate, gate => gate.owner)
  release_gates: ReleaseGate[];

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
