import { IsString, IsUUID, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';

export class ApplyWatermarkDto {
  @IsUUID()
  contentId: string;

  @IsString()
  contentType: string;

  @IsUUID()
  modelId: string;

  @IsString()
  modelName: string;

  @IsIn(['low', 'medium', 'high', 'critical'])
  riskLevel: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceScore?: number;

  @IsOptional()
  @IsString()
  metadata?: string;
}

export class DetectWatermarkDto {
  @IsString()
  contentSample: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}

export class VerifyMarkingDto {
  @IsString()
  watermarkHash: string;

  @IsUUID()
  contentId: string;
}
