import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('domain_search_logs')
export class SearchLog extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 255 })
  query: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  entityType?: string;

  @Column({ type: 'text', nullable: true })
  filters?: Record<string, any>;

  @Column({ type: 'integer', nullable: true })
  resultsCount?: number;

  @Column({ type: 'integer', default: 1 })
  page: number;

  @Column({ type: 'integer', default: 20 })
  pageSize: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, default: 0 })
  durationMs: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sessionId?: string;

  @Column({ type: 'text', nullable: true })
  clickResults?: number[];
}
