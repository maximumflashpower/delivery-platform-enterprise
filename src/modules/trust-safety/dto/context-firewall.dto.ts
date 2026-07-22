import { IsString, IsUUID, IsOptional, IsIn, IsInt, IsBoolean, Min } from 'class-validator';

export class CreateFirewallRuleDto {
  @IsUUID()
  agentId: string;

  @IsString()
  ruleName: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'archived'])
  status?: string;

  @IsOptional()
  @IsIn(['block', 'allow', 'mask', 'warn', 'redirect'])
  action?: string;

  @IsOptional()
  @IsIn(['keyword', 'regex', 'semantic', 'entity_type', 'url_domain', 'data_pattern'])
  ruleType?: string;

  @IsString()
  pattern: string;

  @IsOptional()
  @IsString()
  appliesTo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  priority?: number;

  @IsOptional()
  @IsBoolean()
  caseSensitive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  createdByUserId?: string;
}

export class CreateContextProfileDto {
  @IsUUID()
  agentId: string;

  @IsString()
  profileName: string;

  @IsOptional()
  @IsIn(['restricted', 'standard', 'elevated', 'unrestricted'])
  clearanceLevel?: string;

  @IsOptional()
  @IsString()
  allowedDomains?: string;

  @IsOptional()
  @IsString()
  blockedDomains?: string;

  @IsOptional()
  @IsBoolean()
  piiFiltering?: boolean;

  @IsOptional()
  @IsBoolean()
  credentialFiltering?: boolean;

  @IsOptional()
  @IsBoolean()
  systemPromptProtection?: boolean;

  @IsOptional()
  @IsInt()
  @Min(100)
  maxContextLength?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxRequestsPerMinute?: number;

  @IsOptional()
  @IsBoolean()
  auditLogging?: boolean;
}

export class FilterContextDto {
  @IsUUID()
  agentId: string;

  @IsString()
  context: string;

  @IsOptional()
  @IsUUID()
  sessionId?: string;
}
