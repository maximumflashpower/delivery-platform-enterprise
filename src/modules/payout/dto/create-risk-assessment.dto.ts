import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsOptional, MaxLength, Min, Max } from 'class-validator';

export enum RiskLevelDto {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class CreateRiskAssessmentDto {
  @ApiProperty({ description: 'Sponsor ID' })
  @IsString()
  @MaxLength(255)
  sponsorId: string;

  @ApiProperty({ description: 'Sponsor name' })
  @IsString()
  @MaxLength(255)
  sponsorName: string;

  @ApiProperty({ description: 'Risk level', enum: RiskLevelDto })
  @IsEnum(RiskLevelDto)
  riskLevel: RiskLevelDto;

  @ApiProperty({ description: 'Risk score (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore: number;

  @ApiPropertyOptional({ description: 'Maximum exposure amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxExposure?: number;

  @ApiPropertyOptional({ description: 'Assessed by user ID' })
  @IsOptional()
  @IsString()
  assessedBy?: string;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsString()
  expiresAt?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Flags (JSON array of risk flags)' })
  @IsOptional()
  @IsString()
  flags?: string;
}
