import { IsString, IsOptional, IsBoolean, IsEnum, IsObject } from 'class-validator';

export class CreateRedTeamTestDto {
  @IsString()
  modelId: string;

  @IsString()
  modelName: string;

  @IsString()
  attackVector: string;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  expectedBehavior?: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsBoolean()
  autoRemediate?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateTestResultDto {
  @IsString()
  actualResponse: string;

  @IsBoolean()
  passed: boolean;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsString()
  remediationStatus?: string;

  @IsOptional()
  @IsString()
  remediationNotes?: string;
}

export class CreateFindingDto {
  @IsString()
  testId: string;

  @IsString()
  modelId: string;

  @IsString()
  findingType: string;

  @IsString()
  severity: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  evidence?: string;
}

export class ResolveFindingDto {
  @IsString()
  resolutionNotes: string;
}

export class ListTestsQueryDto {
  @IsOptional()
  @IsString()
  modelId?: string;

  @IsOptional()
  @IsString()
  attackVector?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  offset?: string;
}
