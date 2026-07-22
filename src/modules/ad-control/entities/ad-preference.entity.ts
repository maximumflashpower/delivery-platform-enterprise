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

@Entity('ad_preferences')
@Index(['userId', 'adCategory'], { unique: true })
export class AdPreference {
  @ApiProperty({ description: 'Unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID', example: 'user-123' })
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ApiProperty({
    description: 'Ad category',
    example: 'commercial',
    enum: ['commercial', 'political', 'sponsored_content', 'affiliate', 'behavioral', 'contextual'],
  })
  @Column({ name: 'ad_category', type: 'varchar', length: 50 })
  adCategory: string;

  @ApiProperty({ description: 'Whether user opts in to this ad category', example: false })
  @Column({ name: 'opt_in', type: 'boolean', default: false })
  optIn: boolean;

  @ApiProperty({ description: 'Max ads per day for this category', example: 5, required: false })
  @Column({ name: 'frequency_cap_per_day', type: 'integer', nullable: true })
  frequencyCapPerDay: number | null;

  @ApiProperty({ description: 'Whether behavioral targeting is allowed', example: false })
  @Column({ name: 'targeting_allowed', type: 'boolean', default: false })
  targetingAllowed: boolean;

  @ApiProperty({ description: 'Whether third-party sharing is allowed', example: false })
  @Column({ name: 'third_party_sharing_allowed', type: 'boolean', default: false })
  thirdPartySharingAllowed: boolean;

  @ApiProperty({ description: 'Data retention period in days', example: 90, required: false })
  @Column({ name: 'retention_days', type: 'integer', nullable: true })
  retentionDays: number | null;

  @ApiProperty({ description: 'Additional notes', required: false })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

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
