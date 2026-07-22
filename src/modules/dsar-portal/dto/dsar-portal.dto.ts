import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsArray,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DsarRequestType,
  DsarPriority,
  DataCategory,
  ExportFormat,
  DsarRequestStatus,
} from '../enums/dsar.enums';

// ─── DSAR Request DTOs ───

export class CreateDsarRequestDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  userEmail: string;

  @ApiProperty({ enum: DsarRequestType, example: DsarRequestType.EXPORT })
  @IsEnum(DsarRequestType)
  requestType: DsarRequestType;

  @ApiPropertyOptional({ enum: DsarPriority, example: DsarPriority.NORMAL })
  @IsOptional()
  @IsEnum(DsarPriority)
  priority?: DsarPriority;

  @ApiPropertyOptional({ example: 'Requesting full data export per GDPR Article 20' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-08-22T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateDsarStatusDto {
  @ApiProperty({ enum: DsarRequestStatus })
  @IsEnum(DsarRequestStatus)
  status: DsarRequestStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  identityVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  verifiedBy?: string;
}

// ─── Deletion Scope DTOs ───

export class CreateDeletionScopeDto {
  @ApiProperty()
  @IsUUID()
  requestId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: DataCategory, isArray: true, example: [DataCategory.SEARCH_HISTORY, DataCategory.ANALYTICS] })
  @IsArray()
  @IsEnum(DataCategory, { each: true })
  categories: DataCategory[];

  @ApiPropertyOptional({ example: 'User requested deletion of analytics data' })
  @IsOptional()
  @IsString()
  justification?: string;
}

export class UpdateDeletionScopeDto {
  @ApiPropertyOptional({ enum: DataCategory, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(DataCategory, { each: true })
  categories?: DataCategory[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  justification?: string;
}

export class ExecuteDeletionDto {
  @ApiPropertyOptional({ description: 'Approver UUID' })
  @IsOptional()
  @IsUUID()
  approvedBy?: string;
}

// ─── Export Job DTOs ───

export class CreateExportJobDto {
  @ApiProperty()
  @IsUUID()
  requestId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ enum: ExportFormat, example: ExportFormat.JSON })
  @IsOptional()
  @IsEnum(ExportFormat)
  format?: ExportFormat;

  @ApiPropertyOptional({ enum: DataCategory, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(DataCategory, { each: true })
  includedCategories?: DataCategory[];

  @ApiPropertyOptional({ example: 7, description: 'Days until expiry' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(90)
  expiryDays?: number;
}

// ─── Query DTOs ───

export class DsarQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requestType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
