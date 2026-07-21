import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, IsInt, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExplainabilityDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Type of decision (e.g. ranking, moderation, recommendation)' })
  @IsString()
  @IsNotEmpty()
  decisionType: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  decisionRefId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiPropertyOptional({ description: 'JSON array of factors' })
  @IsString()
  @IsOptional()
  factors?: string;

  @ApiPropertyOptional({ description: 'JSON input data' })
  @IsString()
  @IsOptional()
  inputData?: string;

  @ApiPropertyOptional({ description: 'JSON output data' })
  @IsString()
  @IsOptional()
  outputData?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  confidenceScore?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  modelVersion?: string;

  @ApiPropertyOptional({ enum: ['generated', 'reviewed', 'disputed', 'archived'], default: 'generated' })
  @IsEnum(['generated', 'reviewed', 'disputed', 'archived'])
  @IsOptional()
  status?: string;
}
