import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsIn, MaxLength } from 'class-validator';
import { SETTING_DATA_TYPES, SETTING_CATEGORIES } from '../ad-control.constants';

export class CreateAdControlSettingDto {
  @ApiProperty({ description: 'Setting key', example: 'default_frequency_cap' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  settingKey: string;

  @ApiProperty({ description: 'Setting value', example: '10' })
  @IsString()
  @IsNotEmpty()
  settingValue: string;

  @ApiPropertyOptional({ description: 'Data type', example: 'integer', enum: [...SETTING_DATA_TYPES] })
  @IsOptional()
  @IsString()
  @IsIn([...SETTING_DATA_TYPES])
  dataType?: string;

  @ApiPropertyOptional({ description: 'Category', example: 'frequency', enum: [...SETTING_CATEGORIES] })
  @IsOptional()
  @IsString()
  @IsIn([...SETTING_CATEGORIES])
  category?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Is editable', example: true })
  @IsOptional()
  @IsBoolean()
  isEditable?: boolean;
}
