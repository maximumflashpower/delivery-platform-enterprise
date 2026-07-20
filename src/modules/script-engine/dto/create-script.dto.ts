import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScriptDto {
  @ApiProperty({ description: 'Script name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Script description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Source code' })
  @IsString()
  @IsNotEmpty()
  sourceCode: string;

  @ApiPropertyOptional({ enum: ['javascript', 'typescript', 'lua', 'python', 'custom'], default: 'javascript' })
  @IsEnum(['javascript', 'typescript', 'lua', 'python', 'custom'])
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ enum: ['draft', 'active', 'inactive', 'deprecated', 'locked'], default: 'draft' })
  @IsEnum(['draft', 'active', 'inactive', 'deprecated', 'locked'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Created by user ID' })
  @IsString()
  @IsOptional()
  createdByUserId?: string;

  @ApiPropertyOptional({ description: 'Timeout in seconds', default: 30 })
  @IsInt()
  @Min(1)
  @Max(300)
  @IsOptional()
  timeoutSeconds?: number;

  @ApiPropertyOptional({ description: 'Memory limit in MB', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  memoryLimitMb?: number;

  @ApiPropertyOptional({ description: 'Max concurrent executions', default: 500 })
  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  maxConcurrency?: number;

  @ApiPropertyOptional({ description: 'Script enabled', default: true })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Parameters schema as JSON string' })
  @IsString()
  @IsOptional()
  parameters?: string;

  @ApiPropertyOptional({ description: 'Metadata as JSON string' })
  @IsString()
  @IsOptional()
  metadata?: string;
}
