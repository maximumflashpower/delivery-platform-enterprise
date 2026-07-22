import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsInt, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkPreferenceItemDto {
  @ApiProperty({ description: 'Ad category to update', example: 'commercial' })
  @IsString()
  @IsNotEmpty()
  adCategory: string;

  @ApiPropertyOptional({ description: 'Opt in', example: true })
  @IsOptional()
  @IsBoolean()
  optIn?: boolean;

  @ApiPropertyOptional({ description: 'Frequency cap per day', example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  frequencyCapPerDay?: number;

  @ApiPropertyOptional({ description: 'Targeting allowed', example: false })
  @IsOptional()
  @IsBoolean()
  targetingAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Third-party sharing allowed', example: false })
  @IsOptional()
  @IsBoolean()
  thirdPartySharingAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Retention days', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  retentionDays?: number;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkUpdateAdPreferenceDto {
  @ApiProperty({ description: 'User ID', example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Array of preference updates', type: [BulkPreferenceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkPreferenceItemDto)
  preferences: BulkPreferenceItemDto[];
}
