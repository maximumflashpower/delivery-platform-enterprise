import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { IdentityUser } from '../../identity/entities/identity-user.entity';
import { IncidentSeverity } from '../enums/incident-severity.enum';

@Entity('trust_incidents')
export class Incident extends BaseEntity {
  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reported_user_id' })
  reportedUser?: IdentityUser;

  @Column({ type: 'uuid', nullable: true })
  reportedUserId?: string;

  @ManyToOne(() => IdentityUser, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reporter_id' })
  reporter?: IdentityUser;

  @Column({ type: 'uuid', nullable: true })
  reporterId?: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 50 })
  severity: IncidentSeverity;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'open' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'text', nullable: true })
  resolutionNotes?: string;
}
