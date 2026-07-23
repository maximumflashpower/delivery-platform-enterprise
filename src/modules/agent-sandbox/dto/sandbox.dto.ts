import { IsString, IsUUID, IsOptional, IsIn, IsInt, IsBoolean, Min, Max } from 'class-validator';

export class CreateSandboxDto {
  @IsUUID()
  agentId: string;

  @IsOptional() @IsUUID()
  userId?: string;

  @IsString()
  sandboxName: string;

  @IsOptional() @IsIn(['isolated', 'semi-isolated', 'shared'])
  isolationLevel?: string;

  @IsOptional() @IsIn(['restricted', 'standard', 'elevated', 'unrestricted'])
  clearanceLevel?: string;

  @IsOptional() @IsString()
  environmentConfig?: string;

  @IsOptional() @IsString()
  allowedTools?: string;

  @IsOptional() @IsString()
  blockedTools?: string;

  @IsOptional() @IsInt() @Min(32) @Max(4096)
  maxMemoryMb?: number;

  @IsOptional() @IsInt() @Min(5) @Max(100)
  maxCpuPercent?: number;

  @IsOptional() @IsInt() @Min(5) @Max(3600)
  maxExecutionSeconds?: number;

  @IsOptional() @IsInt() @Min(100)
  maxTokensPerRun?: number;

  @IsOptional() @IsBoolean()
  networkIsolation?: boolean;

  @IsOptional() @IsBoolean()
  filesystemAccess?: boolean;

  @IsOptional() @IsBoolean()
  autoRollback?: boolean;

  @IsOptional() @IsIn(['trace', 'debug', 'info', 'warn', 'error'])
  logLevel?: string;
}

export class ExecuteInSandboxDto {
  @IsUUID()
  sandboxId: string;

  @IsString()
  inputPayload: string;

  @IsOptional() @IsInt()
  timeoutSeconds?: number;
}

export class SnapshotDto {
  @IsUUID()
  sandboxId: string;

  @IsOptional() @IsUUID()
  executionId?: string;
}
