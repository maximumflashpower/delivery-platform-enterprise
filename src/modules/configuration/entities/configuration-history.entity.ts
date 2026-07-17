import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('configuration_history')
export class ConfigurationHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'configId', type: 'uuid' })
  configId: string;

  @Column({ name: 'oldValue', type: 'text', nullable: true })
  oldValue: string | null;

  @Column({ name: 'newValue', type: 'text' })
  newValue: string;

  @Column({ name: 'modifiedByUserId', type: 'uuid' })
  modifiedByUserId: string;

  @Column({ name: 'changeReason', type: 'text', nullable: true })
  changeReason: string | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;
}
