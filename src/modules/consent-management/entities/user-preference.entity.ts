import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Index()
  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'varchar', nullable: true })
  value: string;

  @Column({ type: 'json', nullable: true })
  jsonValue: Record<string, any> | null;

  @Column({ type: 'varchar', default: 'user' })
  source: string;

  @Column({ type: 'varchar', nullable: true })
  defaultValue: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
