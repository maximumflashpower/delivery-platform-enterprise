import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { TrustScoreTrend } from '../enums/trust-score-trend.enum';

@Entity('trust_scores')
export class TrustScore extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: IdentityUser;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'integer', default: 50 })
  score: number;

  @Column({ type: 'varchar', length: 50 })
  trend: TrustScoreTrend;

  @Column({ type: 'timestamp' })
  calculatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  factors?: Record<string, number>;
}
