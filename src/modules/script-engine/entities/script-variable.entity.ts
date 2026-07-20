import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';

@Entity('script_variables')
@Index(['scriptId', 'variableName'])
export class ScriptVariable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  scriptId: string;

  @Column({ length: 100 })
  variableName: string;

  @Column({ length: 50, default: 'string' })
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array' | 'date';

  @Column('text')
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isSecret: boolean;

  @Column({ default: false })
  isRequired: boolean;

  @Column('text', { nullable: true })
  defaultValue: string;

  @Column('text', { nullable: true })
  validationRule: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastModifiedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
