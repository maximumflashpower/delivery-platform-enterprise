import { IsString, IsUUID, IsOptional, IsNumber, Min, Max, IsObject } from 'class-validator';

export class CreateIaDecisionAppealDto {
  @IsUUID()
  appealId: string;

  @IsOptional()
  @IsUUID()
  decisionId?: string;

  @IsString()
  modelName: string;

  @IsString()
  modelId: string;

  @IsString()
  decisionType: 'content_moderation' | 'risk_assessment' | 'policy_violation' | 'safety_flag';

  @IsOptional()
  @IsString()
  aiReasoning?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceScore?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class HumanReviewDto {
  @IsString()
  reviewerId: string;

  @IsString()
  reviewDecision: 'uphold' | 'overturn' | 'request_more_info';

  @IsString()
  reviewNotes: string;

  @IsOptional()
  @IsString()
  overrideReasonCode?: string;
}

export class EscalateToBoardDto {
  @IsString()
  escalationReason: string;

  @IsString()
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}
