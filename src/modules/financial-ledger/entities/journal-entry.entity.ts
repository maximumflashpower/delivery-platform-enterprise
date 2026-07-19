import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { JournalEntryType } from '../enums/journal-entry-type.enum';
import { JournalLine } from './journal-line.entity';

@Entity('financial_journal_entries')
@Index(['entryDate'])
export class JournalEntry extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  entryNumber: string;

  @Column({ type: 'date' })
  entryDate: Date;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  reference?: string;

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status: string;

  @OneToMany(() => JournalLine, (line) => line.entry, { cascade: true, onDelete: 'CASCADE' })
  lines: JournalLine[];
}
