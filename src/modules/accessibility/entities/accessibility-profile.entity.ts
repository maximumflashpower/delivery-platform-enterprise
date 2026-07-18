import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AccessibilityType } from '../enums/accessibility-type.enum';
import { AccessibilityLevel } from '../enums/accessibility-level.enum';

@Entity('accessibility_profiles')
export class AccessibilityProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', enum: AccessibilityType })
  type: AccessibilityType;

  @Column({ type: 'varchar', enum: AccessibilityLevel, default: AccessibilityLevel.MILD })
  level: AccessibilityLevel;

  @Column({ name: 'accommodations', type: 'text', nullable: true })
  accommodations: string[] | null;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
