import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScriptVariableDto {
  @ApiProperty({ description: 'Script ID' })
  @IsUUID()
  @IsNotEmpty()
  scriptId: string;

  @ApiProperty({ description: 'Variable name' })
  @IsString()
  @IsNotEmpty()
  variableName: string;

  @ApiProperty({ enum: ['string', 'number', 'boolean', 'json', 'array', 'date'], default: 'string' })
  @IsEnum(['string', 'number', 'boolean', 'json', 'array', 'date'])
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array' | 'date';

  @ApiProperty({ description: 'Variable value' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Mark as secret (for sensitive data)', default: false })
  @IsBoolean()
  @IsOptional()
  isSecret?: boolean;

  @ApiPropertyOptional({ description: 'Required variable', default: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional({ description: 'Default value' })
  @IsString()
  @IsOptional()
  defaultValue?: string;

  @ApiPropertyOptional({ description: 'Validation rule (regex or JS function)' })
  @IsString()
  @IsOptional()
  validationRule?: string;
}
