import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsEnum,
  IsObject,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─── CONSENT DTOs ───────────────────────────────────────

export class GrantConsentDto {
  @ApiProperty({ example: 'marketing' })
  @IsString()
  purpose: string;

  @ApiPropertyOptional({ example: 'v2.1' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({ example: 'https://docs.example.com/consent-v2.1' })
  @IsOptional()
  @IsString()
  documentUrl?: string;

  @ApiPropertyOptional({ example: '192.168.1.1' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class RevokeConsentDto {
  @ApiPropertyOptional({ example: 'User requested data minimization' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ConsentResponseDto {
  id: string;
  userId: string;
  purpose: string;
  status: string;
  method: string;
  version: string | null;
  documentUrl: string | null;
  grantedAt: Date | null;
  revokedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ListConsentsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  offset?: string;
}

// ─── USER PREFERENCE DTOs ───────────────────────────────

export class SetUserPreferenceDto {
  @ApiProperty({ example: 'communications' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'email_frequency' })
  @IsString()
  key: string;

  @ApiPropertyOptional({ example: 'weekly' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  jsonValue?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source?: string;
}

export class UserPreferenceResponseDto {
  id: string;
  userId: string;
  category: string;
  key: string;
  value: string | null;
  jsonValue: Record<string, any> | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BulkPreferenceUpdateDto {
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetUserPreferenceDto)
  preferences: SetUserPreferenceDto[];
}

// ─── NOTIFICATION PREFERENCE DTOs ───────────────────────

export class SetNotificationPreferenceDto {
  @ApiProperty({ example: 'email' })
  @IsString()
  channel: string;

  @ApiProperty({ example: 'promotional' })
  @IsString()
  communicationType: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsString()
  recipient?: string;

  @ApiPropertyOptional({ example: 'daily' })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  quietStartTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  quietEndTime?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class NotificationPreferenceResponseDto {
  id: string;
  userId: string;
  channel: string;
  communicationType: string;
  enabled: boolean;
  recipient: string | null;
  frequency: string | null;
  quietStartTime: Date | null;
  quietEndTime: Date | null;
  settings: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── HISTORY DTOs ───────────────────────────────────────

export class ConsentHistoryItemDto {
  id: string;
  consentId: string;
  userId: string;
  purpose: string;
  previousStatus: string;
  newStatus: string;
  action: string;
  method: string;
  reason: string | null;
  timestamp: Date;
}
