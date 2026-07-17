import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('translation_keys')
@Index(['namespace', 'key'])
export class TranslationKey extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'namespace', type: 'varchar', length: 100 })
  namespace: string;

  @Column({ name: 'key', type: 'varchar', length: 500 })
  key: string;

  @Column({ name: 'defaultValue', type: 'text', nullable: true })
  defaultValue: string | null;

  @Column({ name: 'category', type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'variables', type: 'jsonb', nullable: true })
  variables: string[] | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'version', type: 'int', default: 1 })
  version: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
