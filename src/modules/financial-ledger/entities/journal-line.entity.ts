import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { JournalEntryType } from '../enums/journal-entry-type.enum';
import { JournalEntry } from './journal-entry.entity';

@Entity('financial_journal_lines')
@Index(['entryId'])
export class JournalLine extends BaseEntity {
  @ManyToOne(() => JournalEntry, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entryId' })
  entry: JournalEntry;

  @Column({ type: 'uuid' })
  entryId: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'varchar', length: 50 })
  type: JournalEntryType;

  @Column({ type: 'decimal', precision: 19, scale: 4 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference?: string;
}
