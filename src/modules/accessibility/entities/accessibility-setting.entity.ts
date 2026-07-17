import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('accessibility_settings')
export class AccessibilitySetting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ name: 'settingKey', type: 'varchar', length: '255' })
  settingKey: string;

  @Column({ name: 'settingValue', type: 'jsonb' })
  settingValue: Record<string, any>;

  @Column({ name: 'isEnabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
