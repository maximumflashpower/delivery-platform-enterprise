import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInferenceLogDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  modelVersionId: string;

  @ApiProperty({ example: 'prediction' })
  @IsString()
  inferenceType: string;

  @ApiPropertyOptional({ example: 'internal' })
  @IsOptional()
  @IsString()
  dataSensitivity?: string;

  @ApiPropertyOptional({ example: 'abc123hash' })
  @IsOptional()
  @IsString()
  inputHash?: string;

  @ApiPropertyOptional({ example: 'User query embedding' })
  @IsOptional()
  @IsString()
  inputSummary?: string;

  @ApiPropertyOptional({ example: 'Top 5 recommendations' })
  @IsOptional()
  @IsString()
  outputSummary?: string;

  @ApiPropertyOptional({ example: 0.87 })
  @IsOptional()
  @IsNumber()
  confidence?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  latencyMs?: number;

  @ApiPropertyOptional({ example: 'search_index' })
  @IsOptional()
  @IsString()
  dataSource?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreatePrivacyBudgetDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ example: 'monthly' })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalCredits?: number;

  @ApiPropertyOptional({ example: 0.01 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  epsilonPerInference?: number;

  @ApiPropertyOptional({ example: 1.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxEpsilon?: number;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  config?: Record<string, any>;
}

export class UpdatePrivacyBudgetDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  totalCredits?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  epsilonPerInference?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxEpsilon?: number;
}

export class CreateBudgetTransactionDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'consumption' })
  @IsString()
  transactionType: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  creditsAmount?: number;

  @ApiPropertyOptional({ example: 0.01 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  epsilonAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  inferenceLogId?: string;

  @ApiPropertyOptional({ example: 'Recommendation inference' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class InferenceQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  inferenceType?: string;

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
