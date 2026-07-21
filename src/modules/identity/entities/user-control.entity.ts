import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('identity_user_controls')
export class UserControl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ length: 100 })
  controlType: string;

  @Column({ length: 50, default: 'opt-in' })
  scope: 'opt-in' | 'opt-out' | 'mandatory' | 'conditional';

  @Column({ type: 'boolean', default: false })
  isEnabled: boolean;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  conditions: string;

  @Column({ type: 'datetime', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'datetime', nullable: true })
  effectiveUntil: Date | null;

  @Column({ type: 'datetime', nullable: true })
  lastModifiedAt: Date;

  @Column('uuid', { nullable: true })
  modifiedBy: string | null;

  @Column({ type: 'int', default: 0 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
