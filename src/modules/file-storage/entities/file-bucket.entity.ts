import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { StorageProvider } from '../enums/storage-provider.enum';

@Entity('file_buckets')
export class FileBucket extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bucketName', type: 'varchar', length: 255, unique: true })
  bucketName: string;

  @Column({ name: 'displayName', type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'enum', enum: StorageProvider })
  provider: StorageProvider;

  @Column({ type: 'varchar', length: 255 })
  endpointUrl: string;

  @Column({ type: 'varchar', length: 255 })
  region: string;

  @Column({ name: 'maxFileSizeBytes', type: 'bigint', default: 10485760 })
  maxFileSizeBytes: number;

  @Column({ name: 'allowedFileTypes', type: 'jsonb', nullable: true })
  allowedFileTypes: string[] | null;

  @Column({ name: 'isPublic', type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ name: 'totalFilesCount', type: 'int', default: 0 })
  totalFilesCount: number;

  @Column({ name: 'totalSizeBytes', type: 'bigint', default: 0 })
  totalSizeBytes: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
