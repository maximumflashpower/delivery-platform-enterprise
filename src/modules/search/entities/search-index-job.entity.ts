import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IndexStatus } from '../enums/index-status.enum';
import { IndexEntityType } from '../enums/index-entity-type.enum';

@Entity('domain_search_index_jobs')
export class SearchIndexJob extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  jobCode: string;

  @Column({ type: 'varchar', length: 50, default: IndexStatus.PENDING })
  status: IndexStatus;

  @Column({ type: 'varchar', length: 50 })
  entityType: IndexEntityType;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'text', nullable: true })
  indexedData?: Record<string, any>;

  @Column({ type: 'datetime', nullable: true })
  indexedAt?: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'integer', default: 0 })
  retryCount: number;
}
