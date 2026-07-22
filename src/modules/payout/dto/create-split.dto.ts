import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsArray, ValidateNested, IsOptional, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum SplitTypeDto {
  COLLABORATION = 'collaboration',
  SPONSOR_RISK = 'sponsor_risk',
  HYBRID = 'hybrid',
}

export class SplitParticipantDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'User display name' })
  @IsString()
  @MaxLength(255)
  userName: string;

  @ApiProperty({ description: 'Role in the split' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'Share percentage (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  sharePercentage: number;

  @ApiPropertyOptional({ description: 'Contribution score (0-100)', default: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  contributionScore?: number;

  @ApiPropertyOptional({ description: 'Risk adjustment factor (-50 to 50)', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(-50)
  @Max(50)
  riskAdjustment?: number;
}

export class CreateSplitDto {
  @ApiProperty({ description: 'Split type', enum: SplitTypeDto })
  @IsEnum(SplitTypeDto)
  splitType: SplitTypeDto;

  @ApiProperty({ description: 'Total amount to split' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ description: 'Currency code', default: 'USD' })
  @IsString()
  @MaxLength(3)
  currency: string;

  @ApiPropertyOptional({ description: 'Reference ID' })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional({ description: 'Reference type' })
  @IsOptional()
  @IsString()
  referenceType?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Risk assessment ID for sponsor_risk type' })
  @IsOptional()
  @IsString()
  riskAssessmentId?: string;

  @ApiProperty({ description: 'Created by user ID' })
  @IsString()
  createdBy: string;

  @ApiProperty({ description: 'Participants', type: () => [SplitParticipantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SplitParticipantDto)
  participants: SplitParticipantDto[];
}
