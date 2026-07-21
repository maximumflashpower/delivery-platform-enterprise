import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { Proposal } from './proposal.entity';

@Entity('governance_assemblies')
export class Assembly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  scheduledStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledEnd: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEnd: Date;

  @Column({ length: 50, default: 'draft' })
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';

  @Column({ length: 100, default: 'general' })
  type: 'general' | 'emergency' | 'budget' | 'amendment' | 'election';

  @Column('uuid', { nullable: true })
  communityId: string;

  @Column({ default: true })
  allowsRemoteVoting: boolean;

  @Column({ default: false })
  requiresQuorum: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50 })
  quorumPercentage: number;

  @Column('uuid', { nullable: true })
  createdByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Proposal, proposal => proposal.assembly)
  proposals: Proposal[];
  participants: any[];
}
