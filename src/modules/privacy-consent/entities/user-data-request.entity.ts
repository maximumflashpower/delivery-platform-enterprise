import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum RequestType {
  ACCESS = 'access',
  RECTIFICATION = 'rectification',
  ERASURE = 'erasure',
  PORTABILITY = 'portability',
 _RESTRICTION = 'restriction',
  OBJECTION = 'objection'
}

export enum RequestStatus {
  SUBMITTED = 'submitted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

@Entity('user_data_requests')
export class UserDataRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  request_type: RequestType;

  @Column({ type: 'varchar', length: 50 })
  status: RequestStatus;

  @Column({ type: 'text', nullable: true })
  additional_details: string;

  @Column({ length: 255, nullable: true })
  delivery_method: string;

  @Column({ length: 255, nullable: true })
  delivery_url: string;

  @Column({ type: 'datetime', nullable: true })
  submitted_at: Date;

  @Column({ type: 'datetime', nullable: true })
  processed_at: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  @Column({ length: 50, nullable: true })
  processed_by: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
