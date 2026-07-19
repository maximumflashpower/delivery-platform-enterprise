import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { StorageProvider } from '../enums/storage-provider.enum';
import { FileType } from '../enums/file-type.enum';
import { FileStatus } from '../enums/file-status.enum';

@Entity('stored_files')
export class StoredFile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fileName', type: 'varchar', length: 500 })
  fileName: string;

  @Column({ name: 'originalName', type: 'varchar', length: 500 })
  originalName: string;

  @Column({ type: 'varchar', enum: FileType })
  fileType: FileType;

  @Column({ name: 'mimeType', type: 'varchar', length: 255 })
  mimeType: string;

  @Column({ name: 'fileSizeBytes', type: 'bigint' })
  fileSizeBytes: number;

  @Column({ name: 'storageProvider', type: 'varchar', enum: StorageProvider })
  storageProvider: StorageProvider;

  @Column({ type: 'varchar', length: 500 })
  storagePath: string;

  @Column({ name: 'publicUrl', type: 'varchar', length: 1000, nullable: true })
  publicUrl: string | null;

  @Column({ name: 'downloadUrl', type: 'varchar', length: 1000, nullable: true })
  downloadUrl: string | null;

  @Column({ name: 'bucketName', type: 'varchar', length: 255, nullable: true })
  bucketName: string | null;

  @Column({ type: 'varchar', enum: FileStatus, default: FileStatus.UPLOADED })
  status: FileStatus;

  @Column({ name: 'uploadedByUserId', type: 'varchar' })
  uploadedByUserId: string;

  @Column({ type: 'text', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'checksum', type: 'varchar', length: 64, nullable: true })
  checksum: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
