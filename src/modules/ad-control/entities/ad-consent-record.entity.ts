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

@Entity('ad_consent_records')
@Index(['userId', 'consentType'])
export class AdConsentRecord {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID', example: 'user-123' })
  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @ApiProperty({
    description: 'Ad campaign ID (nullable for category-wide consent)',
    required: false,
  })
  @Column({ name: 'ad_campaign_id', type: 'varchar', length: 36, nullable: true })
  adCampaignId: string | null;

  @ApiProperty({
    description: 'Ad category',
    example: 'commercial',
    enum: ['commercial', 'political', 'sponsored_content', 'affiliate', 'behavioral', 'contextual'],
  })
  @Column({ name: 'ad_category', type: 'varchar', length: 50 })
  adCategory: string;

  @ApiProperty({
    description: 'Type of consent',
    example: 'personalized',
    enum: ['personalized', 'frequency_capping', 'behavioral_targeting', 'third_party_sharing'],
  })
  @Column({ name: 'consent_type', type: 'varchar', length: 50 })
  consentType: string;

  @ApiProperty({ description: 'Whether consent is granted', example: true })
  @Column({ name: 'consent_value', type: 'boolean', default: false })
  consentValue: boolean;

  @ApiProperty({
    description: 'How consent was obtained',
    example: 'explicit_opt_in',
    enum: ['explicit_opt_in', 'implicit_consent', 'default_opt_out', 'cookie_banner'],
  })
  @Column({ name: 'consent_method', type: 'varchar', length: 50, default: 'default_opt_out' })
  consentMethod: string;

  @ApiProperty({ description: 'IP address of consent action', required: false })
  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @ApiProperty({ description: 'User agent of consent action', required: false })
  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @ApiProperty({ description: 'Consent validity end date', required: false })
  @Column({ name: 'valid_until', type: 'datetime', nullable: true })
  validUntil: Date | null;

  @ApiProperty({ description: 'When consent was revoked', required: false })
  @Column({ name: 'revoked_at', type: 'datetime', nullable: true })
  revokedAt: Date | null;

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
