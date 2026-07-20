import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ExecutionContext {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  scriptId?: string;

  @ApiPropertyOptional({ type: Object })
  @IsObject()
  @IsOptional()
  inputData?: Record<string, any>;
}

export class ExecuteScriptDto {
  @ApiProperty({ description: 'Triggering user ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Script ID (optional for inline)' })
  @IsUUID()
  @IsOptional()
  scriptId?: string;

  @ApiPropertyOptional({ description: 'Inline source code (if no scriptId)' })
  @IsString()
  @IsOptional()
  sourceCode?: string;

  @ApiPropertyOptional({ description: 'Input parameters' })
  @IsOptional()
  @IsObject()
  inputParameters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Trigger type', default: 'manual' })
  @IsString()
  @IsOptional()
  triggerType?: 'manual' | 'scheduled' | 'event' | 'api' | 'webhook';

  @ApiPropertyOptional({ description: 'Override timeout in seconds' })
  @IsString()
  @IsOptional()
  timeoutSeconds?: string;

  @ApiPropertyOptional({ description: 'Async execution', default: false })
  @IsString()
  @IsOptional()
  async?: string;
}
