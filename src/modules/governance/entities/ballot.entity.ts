import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Assembly } from './assembly.entity';
import { Vote } from './vote.entity';

@Entity('governance_ballots')
export class Ballot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  assemblyId: string;

  @ManyToOne(() => Assembly, { onDelete: 'CASCADE' })
  assembly: Assembly;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, default: 'simple' })
  method: 'simple' | 'majority' | 'supermajority' | 'ranked_choice' | 'approval';

  @Column({ type: 'int', default: 1 })
  minChoices: number;

  @Column({ type: 'int', default: 1 })
  maxChoices: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  opensAt: Date;

  @Column({ type: 'datetime', nullable: true })
  closesAt: Date;

  @Column({ type: 'int', default: 0 })
  voteCount: number;

  @OneToMany(() => Vote, vote => vote.ballot)
  votes: Vote[];

  @Column({ type: 'text', nullable: true })
  resultsSummary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
