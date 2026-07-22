import { IsString, IsUUID, IsOptional, IsIn } from 'class-validator';

export class CreatePolicyDto {
  @IsString()
  policyName: string;

  @IsOptional()
  @IsIn(['draft', 'active', 'deprecated'])
  status?: string;

  @IsOptional()
  @IsString()
  applicableTo?: string;

  @IsOptional()
  @IsIn(['optional', 'recommended', 'mandatory', 'forbidden'])
  requirementLevel?: string;

  @IsOptional()
  @IsString()
  riskThresholds?: string;

  @IsOptional()
  @IsString()
  allowedModels?: string;

  @IsOptional()
  @IsString()
  blockedModels?: string;

  @IsOptional()
  @IsString()
  rationale?: string;

  @IsOptional()
  @IsUUID()
  createdByUserId?: string;
}

export class EvaluateContentDto {
  @IsUUID()
  contentId: string;

  @IsString()
  contentType: string;

  @IsString()
  modelName: string;

  @IsOptional()
  @IsString()
  riskLevel?: string;
}
