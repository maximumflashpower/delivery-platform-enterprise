import { IsString, IsUUID, IsOptional, IsIn, IsObject, IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateAgentSecurityTestDto {
  @IsUUID()
  agentId: string;

  @IsString()
  agentName: string;

  @IsString()
  testScenarioName: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  riskLevel?: string;

  @IsOptional()
  @IsIn(['automated', 'manual', 'red_team', 'fuzz', 'prompt_injection'])
  testType?: string;

  @IsOptional()
  @IsString()
  testDescription?: string;

  @IsOptional()
  @IsString()
  inputPayload?: string;

  @IsOptional()
  @IsObject()
  toolAccessList?: any;

  @IsOptional()
  @IsUUID()
  createdByUserId?: string;
}

export class CreateToolInventoryDto {
  @IsUUID()
  agentId: string;

  @IsString()
  toolName: string;

  @IsIn(['file_access', 'network_call', 'database_query', 'code_execution', 'external_api', 'notification', 'data_read', 'data_write'])
  toolType: string;

  @IsOptional()
  @IsIn(['enabled', 'disabled', 'restricted', 'quarantined'])
  status?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  riskRating?: string;

  @IsOptional()
  @IsString()
  permissionsScope?: string;

  @IsOptional()
  @IsString()
  rateLimitConfig?: string;
}

export class RegisterResultDto {
  @IsUUID()
  testId: string;

  @IsUUID()
  agentId: string;

  @IsIn(['pass', 'fail', 'warning', 'blocked'])
  overallResult: string;

  @IsOptional()
  @IsInt()
  findingsCount?: number;

  @IsOptional()
  @IsInt()
  criticalFindings?: number;

  @IsOptional()
  @IsInt()
  warningsCount?: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsObject()
  findings?: any;

  @IsOptional()
  @IsString()
  remediationNotes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  securityScore?: number;

  @IsOptional()
  @IsString()
  assessmentMethod?: string;
}

export class QuarantineToolDto {
  @IsUUID()
  toolId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
