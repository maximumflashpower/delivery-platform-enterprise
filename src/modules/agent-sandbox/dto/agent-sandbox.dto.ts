import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max, IsObject } from 'class-validator';

export class CreateSandboxDto {
  @IsString()
  agentId: string;

  @IsString()
  agentName: string;

  @IsOptional()
  @IsString()
  configName?: string;

  @IsOptional()
  @IsString()
  imageRef?: string;

  @IsOptional()
  @IsNumber()
  @Max(100)
  maxCpuPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(128)
  maxMemoryMb?: number;

  @IsOptional()
  @IsNumber()
  @Min(256)
  maxDiskMb?: number;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  maxExecutionTimeMs?: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  maxTokensPerExecution?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxApiCallsPerExecution?: number;

  @IsOptional()
  @IsBoolean()
  networkAccess?: boolean;

  @IsOptional()
  @IsString({ each: true })
  allowedHosts?: string[];

  @IsOptional()
  @IsObject()
  envVars?: Record<string, any>;
}

export class ExecuteInSandboxDto {
  @IsString()
  sandboxId: string;

  @IsObject()
  inputPayload: Record<string, any>;
}

export class TerminateSandboxDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class PauseSandboxDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
