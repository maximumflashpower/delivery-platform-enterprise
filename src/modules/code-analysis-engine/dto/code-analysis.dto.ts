import { IsString, IsOptional, IsBoolean, IsInt, IsIn, Min, Max } from 'class-validator';

export class CreateScanDto {
  @IsString()
  @IsOptional()
  targetType?: string;

  @IsString()
  @IsOptional()
  targetPath?: string;

  @IsString()
  @IsOptional()
  triggeredBy?: string;
}

export class CreateRuleDto {
  @IsString()
  ruleName: string;

  @IsString()
  ruleType: string;

  @IsString()
  pattern: string;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  cweId?: string;

  @IsString()
  @IsOptional()
  remediation?: string;
}

export class UpdateRuleDto {
  @IsString()
  @IsOptional()
  ruleName?: string;

  @IsString()
  @IsOptional()
  pattern?: string;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  remediation?: string;
}

export class UpdateFindingStatusDto {
  @IsString()
  @IsIn(['open', 'resolved', 'ignored'])
  status: string;
}
