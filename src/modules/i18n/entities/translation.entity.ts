import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { TranslationStatus } from '../enums/translation-status.enum';

@Entity('translations')
@Index(['translationKeyId', 'languageId'])
export class Translation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'translationKeyId', type: 'uuid' })
  translationKeyId: string;

  @Column({ name: 'languageId', type: 'uuid' })
  languageId: string;

  @Column({ name: 'value', type: 'text' })
  value: string;

  @Column({ type: 'enum', enum: TranslationStatus, default: TranslationStatus.PENDING })
  status: TranslationStatus;

  @Column({ name: 'reviewedByUserId', type: 'uuid', nullable: true })
  reviewedByUserId: string | null;

  @Column({ name: 'reviewedAt', type: 'timestamp with time zone', nullable: true })
  reviewedAt: Date | null;

  @Column({ name: 'version', type: 'int', default: 1 })
  version: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
