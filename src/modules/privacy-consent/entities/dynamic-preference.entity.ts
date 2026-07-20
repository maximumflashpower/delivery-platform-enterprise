import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('dynamic_preferences')
export class DynamicPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ length: 100 })
  preference_key: string;

  @Column({ type: 'text' })
  preference_value: string;

  @Column({ length: 100, nullable: true })
  scope: string;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @Column('uuid', { name: 'config_ref_id', nullable: true })
  configRefId: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
