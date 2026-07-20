import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScriptTemplateDto {
  @ApiProperty({ description: 'Script ID' })
  @IsUUID()
  @IsNotEmpty()
  scriptId: string;

  @ApiProperty({ description: 'Template name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Configuration as JSON' })
  @IsString()
  @IsNotEmpty()
  configuration: string;

  @ApiPropertyOptional({ description: 'Default input values as JSON' })
  @IsString()
  @IsOptional()
  defaultInputValues?: string;

  @ApiPropertyOptional({ enum: ['standard', 'secure', 'sandbox', 'elevated'], default: 'standard' })
  @IsString()
  @IsOptional()
  environment?: 'standard' | 'secure' | 'sandbox' | 'elevated';

  @ApiPropertyOptional({ description: 'Timeout in seconds', default: 3600 })
  @IsInt()
  @Min(1)
  @Max(86400)
  @IsOptional()
  timeoutSeconds?: number;

  @ApiPropertyOptional({ description: 'Concurrency limit', default: 1 })
  @IsInt()
  @Min(0.1)
  @Max(100)
  @IsOptional()
  concurrencyLimit?: number;

  @ApiPropertyOptional({ description: 'Success callback URL' })
  @IsString()
  @IsOptional()
  successCallback?: string;

  @ApiPropertyOptional({ description: 'Failure callback URL' })
  @IsString()
  @IsOptional()
  failureCallback?: string;

  @ApiPropertyOptional({ description: 'Schedule start time' })
  @IsString()
  @IsOptional()
  scheduledStart?: string;

  @ApiPropertyOptional({ description: 'Schedule end time' })
  @IsString()
  @IsOptional()
  scheduledEnd?: string;
}
