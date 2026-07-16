import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { ClaimCategory } from '../enums/claim-category.enum';
import { ClaimPriority } from '../enums/claim-priority.enum';

@Entity('domain_sla_configs')
export class SlaConfig extends BaseEntity {
  @Column({ type: 'varchar', length: 50, default: ClaimCategory.OTHER })
  category: ClaimCategory;

  @Column({ type: 'varchar', length: 50, default: ClaimPriority.MEDIUM })
  priority: ClaimPriority;

  @Column({ type: 'integer', default: 24 })
  responseTimeHours: number;

  @Column({ type: 'integer', default: 72 })
  resolutionTimeHours: number;

  @Column({ type: 'integer', default: 2 })
  escalationDelayHours: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  escalationEmail?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
