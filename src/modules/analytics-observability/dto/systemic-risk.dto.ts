import { IsString, IsEnum, IsOptional, IsNumber, IsUUID, IsArray, IsObject, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndicatorCategory, IndicatorSeverity, IndicatorTrend, IndicatorStatus } from '../entities/systemic-risk-indicator.entity';
import { CorrelationType } from '../entities/risk-correlation.entity';

// ─── Indicators ───

export class CreateIndicatorDto {
  @ApiProperty()
  @IsString()
  indicatorName: string;

  @ApiProperty({ enum: IndicatorCategory })
  @IsEnum(IndicatorCategory)
  category: IndicatorCategory;

  @ApiProperty({ enum: IndicatorSeverity })
  @IsEnum(IndicatorSeverity)
  severity: IndicatorSeverity;

  @ApiPropertyOptional({ enum: IndicatorTrend })
  @IsOptional()
  @IsEnum(IndicatorTrend)
  trend?: IndicatorTrend;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  currentValue: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  thresholdValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  previousValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sourceSystem?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}

export class UpdateIndicatorDto {
  @ApiPropertyOptional({ enum: IndicatorSeverity })
  @IsOptional()
  @IsEnum(IndicatorSeverity)
  severity?: IndicatorSeverity;

  @ApiPropertyOptional({ enum: IndicatorTrend })
  @IsOptional()
  @IsEnum(IndicatorTrend)
  trend?: IndicatorTrend;

  @ApiPropertyOptional({ enum: IndicatorStatus })
  @IsOptional()
  @IsEnum(IndicatorStatus)
  status?: IndicatorStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  previousValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mitigationPlan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}

// ─── Correlations ───

export class CreateCorrelationDto {
  @ApiProperty()
  @IsUUID()
  indicatorAId: string;

  @ApiProperty()
  @IsUUID()
  indicatorBId: string;

  @ApiProperty()
  @IsNumber()
  correlationCoefficient: number;

  @ApiProperty({ enum: CorrelationType })
  @IsEnum(CorrelationType)
  correlationType: CorrelationType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  confidenceScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  analysis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  detectedByMethod?: string;
}

// ─── Incidents ───

export class CreateIncidentDto {
  @ApiProperty()
  @IsString()
  incidentName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  triggerIndicatorId?: string;

  @ApiProperty()
  @IsString()
  severity: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  impactAssessment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  affectedSystems?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ResolveIncidentDto {
  @ApiProperty()
  @IsString()
  rootCause: string;

  @ApiProperty()
  @IsString()
  resolutionNotes: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  resolvedBy?: string;
}
