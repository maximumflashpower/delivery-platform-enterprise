import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('file_editor_drafts')
export class FileEditorDraft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 100, default: 'markdown' })
  format: 'markdown' | 'html' | 'rst' | 'latex' | 'plaintext';

  @Column('uuid', { nullable: true })
  originalFileId: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column('text', { nullable: true })
  metadata: string;

  @Column('text', { nullable: true })
  tags: string;

  @Column({ type: 'datetime', nullable: true })
  autoSaveAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
