import { IsString, IsUUID, IsOptional, IsIn, IsInt, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateRateLimitConfigDto {
  @IsUUID()
  agentId: string;

  @IsString()
  configName: string;

  @IsOptional() @IsIn(['active', 'inactive', 'paused'])
  status?: string;

  @IsOptional() @IsInt() @Min(1)
  maxRequestsPerMinute?: number;

  @IsOptional() @IsInt() @Min(1)
  maxRequestsPerHour?: number;

  @IsOptional() @IsInt() @Min(1)
  maxRequestsPerDay?: number;

  @IsOptional() @IsInt() @Min(100)
  maxTokensPerMinute?: number;

  @IsOptional() @IsInt() @Min(1000)
  maxTokensPerHour?: number;

  @IsOptional() @IsInt() @Min(10000)
  maxTokensPerDay?: number;

  @IsOptional() @IsNumber() @Min(0)
  maxCostPerDay?: number;

  @IsOptional() @IsNumber() @Min(0)
  maxCostPerMonth?: number;

  @IsOptional() @IsInt() @Min(1)
  burstSize?: number;

  @IsOptional() @IsInt() @Min(1000)
  cooldownMs?: number;

  @IsOptional() @IsIn(['reject', 'queue', 'delay'])
  excessAction?: string;

  @IsOptional() @IsBoolean()
  circuitBreakerEnabled?: boolean;

  @IsOptional() @IsInt() @Min(1)
  circuitBreakerThreshold?: number;

  @IsOptional() @IsInt() @Min(1000)
  circuitBreakerTimeoutMs?: number;
}

export class CheckRateLimitDto {
  @IsUUID()
  agentId: string;

  @IsOptional() @IsUUID()
  sessionId?: string;

  @IsOptional() @IsInt() @Min(1)
  tokenEstimate?: number;
}

export class RecordUsageDto {
  @IsUUID()
  agentId: string;

  @IsOptional() @IsUUID()
  sessionId?: string;

  @IsInt() @Min(1)
  tokensUsed: number;

  @IsOptional() @IsNumber() @Min(0)
  costAmount?: number;

  @IsOptional() @IsInt() @Min(0)
  responseTimeMs?: number;

  @IsBoolean()
  success: boolean;

  @IsOptional() @IsString()
  failureReason?: string;
}
