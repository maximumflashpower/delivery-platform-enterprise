import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('file_collaborators')
export class FileCollaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  fileId: string;

  @Column('uuid')
  userId: string;

  @Column({ length: 50, default: 'viewer' })
  role: 'owner' | 'editor' | 'commenter' | 'viewer';

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column('uuid', { nullable: true })
  invitedBy: string;

  @Column({ type: 'datetime', nullable: true })
  acceptedAt: Date;

  @Column('text', { nullable: true })
  permissions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
