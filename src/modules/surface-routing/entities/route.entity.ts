import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('routes')
export class Route extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  routeId: string;

  @Column({ type: 'jsonb' })
  waypoints: Array<{ lat: number; lng: number; order: number }>;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  distanceKm?: number;

  @Column({ type: 'integer', nullable: true })
  estimatedDurationSeconds?: number;

  @Column({ type: 'varchar', length: 50, default: 'optimal' })
  optimizationMode: string;
}
