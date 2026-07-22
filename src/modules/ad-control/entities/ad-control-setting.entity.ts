import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('ad_control_settings')
@Index(['settingKey'], { unique: true })
export class AdControlSetting {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Setting key', example: 'default_frequency_cap' })
  @Column({ name: 'setting_key', type: 'varchar', length: 100, unique: true })
  settingKey: string;

  @ApiProperty({ description: 'Setting value', example: '10' })
  @Column({ name: 'setting_value', type: 'text' })
  settingValue: string;

  @ApiProperty({
    description: 'Data type of the setting value',
    example: 'integer',
    enum: ['string', 'boolean', 'integer', 'json'],
  })
  @Column({ name: 'data_type', type: 'varchar', length: 20, default: 'string' })
  dataType: string;

  @ApiProperty({
    description: 'Setting category',
    example: 'frequency',
    enum: ['targeting', 'frequency', 'privacy', 'transparency', 'disclosure'],
  })
  @Column({ name: 'category', type: 'varchar', length: 50, default: 'privacy' })
  category: string;

  @ApiProperty({ description: 'Human-readable description', required: false })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Whether the setting is editable', example: true })
  @Column({ name: 'is_editable', type: 'boolean', default: true })
  isEditable: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Soft delete timestamp', required: false })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
