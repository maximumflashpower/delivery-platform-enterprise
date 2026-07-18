import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
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

  @Column({ type: 'varchar', enum: TranslationStatus, default: TranslationStatus.PENDING })
  status: TranslationStatus;

  @Column({ name: 'reviewedByUserId', type: 'uuid', nullable: true })
  reviewedByUserId: string | null;

  @Column({ name: 'reviewedAt', type: 'datetime', nullable: true })
  reviewedAt: Date | null;

  @Column({ name: 'version', type: 'int', default: 1 })
  version: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
