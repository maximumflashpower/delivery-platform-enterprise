import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('file_rights')
export class FileRights {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  fileId: string;

  @Column('uuid')
  rightsHolderId: string;

  @Column({ length: 100 })
  rightsType: 'copyright' | 'creative-commons' | 'public-domain' | 'proprietary' | 'open-source';

  @Column({ length: 100, nullable: true })
  license: string;

  @Column({ length: 100, nullable: true })
  licenseUrl: string;

  @Column({ type: 'datetime', nullable: true })
  validFrom: Date;

  @Column({ type: 'datetime', nullable: true })
  validUntil: Date;

  @Column('text', { nullable: true })
  usageRestrictions: string;

  @Column('text', { nullable: true })
  attributionRequired: string;

  @Column({ type: 'boolean', default: false })
  commercialUseAllowed: boolean;

  @Column({ type: 'boolean', default: true })
  modificationsAllowed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
