import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('file_multi_format_publications')
export class MultiFormatPublication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sourceFileId: string;

  @Column('uuid')
  createdByUserId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  sourceFormat: string;

  @Column('text')
  outputFormats: string;

  @Column({ length: 50, default: 'draft' })
  status: 'draft' | 'processing' | 'published' | 'failed';

  @Column('text', { nullable: true })
  publicationUrls: string;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
