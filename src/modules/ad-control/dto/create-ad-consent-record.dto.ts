import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsIn, IsDateString } from 'class-validator';
import { AD_CATEGORIES, CONSENT_TYPES, CONSENT_METHODS } from '../ad-control.constants';

export class CreateAdConsentRecordDto {
  @ApiProperty({ description: 'User ID', example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Ad campaign ID (for campaign-specific consent)' })
  @IsOptional()
  @IsString()
  adCampaignId?: string;

  @ApiProperty({ description: 'Ad category', example: 'commercial', enum: [...AD_CATEGORIES] })
  @IsString()
  @IsIn([...AD_CATEGORIES])
  adCategory: string;

  @ApiProperty({ description: 'Consent type', example: 'personalized', enum: [...CONSENT_TYPES] })
  @IsString()
  @IsIn([...CONSENT_TYPES])
  consentType: string;

  @ApiPropertyOptional({ description: 'Consent value', example: true })
  @IsOptional()
  @IsBoolean()
  consentValue?: boolean;

  @ApiPropertyOptional({ description: 'Consent method', example: 'explicit_opt_in', enum: [...CONSENT_METHODS] })
  @IsOptional()
  @IsString()
  @IsIn([...CONSENT_METHODS])
  consentMethod?: string;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Validity end date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;
}
