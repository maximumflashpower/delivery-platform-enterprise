import { IsString, IsEnum, IsOptional, IsUUID, IsObject, IsInt, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EvidenceType, PreservationStatus, SeverityLevel } from '../entities/evidence-preservation.entity';

export class CreateEvidenceDto {
  @ApiProperty()
  @IsString()
  caseName: string;

  @ApiProperty({ enum: EvidenceType })
  @IsEnum(EvidenceType)
  evidenceType: EvidenceType;

  @ApiPropertyOptional({ enum: SeverityLevel })
  @IsOptional()
  @IsEnum(SeverityLevel)
  severity?: SeverityLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  relatedEntityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  evidenceData?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  preservedBy?: string;
}

export class SealEvidenceDto {
  @ApiProperty()
  @IsString()
  hashChecksum: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageLocation?: string;
}

export class VerifyChainDto {
  @ApiProperty()
  @IsUUID()
  verifiedBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReleaseEvidenceDto {
  @ApiProperty()
  @IsUUID()
  releasedBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
