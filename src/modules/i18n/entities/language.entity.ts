import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { LanguageCode } from '../enums/language-code.enum';

@Entity('languages')
export class Language extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', enum: LanguageCode, unique: true })
  code: LanguageCode;

  @Column({ name: 'displayName', type: 'varchar', length: 100 })
  displayName: string;

  @Column({ name: 'nativeName', type: 'varchar', length: 100 })
  nativeName: string;

  @Column({ name: 'direction', type: 'varchar', length: 10, default: 'ltr' })
  direction: string;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'isDefault', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'regionCode', type: 'varchar', length: 10, nullable: true })
  regionCode: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
