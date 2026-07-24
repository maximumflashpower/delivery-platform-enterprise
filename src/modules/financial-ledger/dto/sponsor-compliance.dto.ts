import { IsString, IsEnum, IsOptional, IsUUID, IsBoolean, IsDate, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComplianceCheckType, ComplianceAction } from '../entities/sponsor-compliance-record.entity';

export class CreateComplianceRecordDto {
  @ApiProperty()
  @IsUUID()
  sponsorId: string;

  @ApiProperty()
  @IsString()
  sponsorName: string;

  @ApiProperty()
  @IsString()
  @IsEnum(ComplianceCheckType)
  checkType: ComplianceCheckType;

  @ApiProperty()
  @IsString()
  @IsEnum(ComplianceAction)
  action: ComplianceAction;

  @ApiProperty()
  @IsBoolean()
  isPassed: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  documents?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  expiresAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reviewedBy?: string;
}

export class UpdateComplianceRecordDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewerNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  nextReviewDue?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewStatus?: string;
}
