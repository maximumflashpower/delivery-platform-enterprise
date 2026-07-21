import { IsString, IsUUID, IsNumber, IsOptional, Min, Max, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityHealthMetricDto {
  @ApiProperty()
  @IsString()
  metricName: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  communityId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  baseline?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  percentage?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  score?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  target?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  current?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  threshold?: number;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  recordedAt?: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isCritical?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
