import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('file_versions')
export class FileVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  fileId: string;

  @Column('uuid')
  createdByUserId: string;

  @Column({ type: 'int' })
  versionNumber: number;

  @Column('text')
  content: string;

  @Column({ length: 100 })
  format: string;

  @Column('text', { nullable: true })
  changeDescription: string;

  @Column({ type: 'boolean', default: false })
  isCurrent: boolean;

  @Column('text', { nullable: true })
  checksum: string;

  @Column({ type: 'int', default: 0 })
  sizeBytes: number;

  @CreateDateColumn()
  createdAt: Date;
}
