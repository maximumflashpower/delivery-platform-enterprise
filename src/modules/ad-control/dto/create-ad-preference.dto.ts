import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt, IsOptional, IsNotEmpty, Min, MaxLength, IsIn } from 'class-validator';
import { AD_CATEGORIES } from '../ad-control.constants';

export class CreateAdPreferenceDto {
  @ApiProperty({ description: 'User ID', example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Ad category', example: 'commercial', enum: [...AD_CATEGORIES] })
  @IsString()
  @IsIn([...AD_CATEGORIES])
  adCategory: string;

  @ApiPropertyOptional({ description: 'Opt in to this ad category', example: false })
  @IsOptional()
  @IsBoolean()
  optIn?: boolean;

  @ApiPropertyOptional({ description: 'Max ads per day', example: 5, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  frequencyCapPerDay?: number;

  @ApiPropertyOptional({ description: 'Allow behavioral targeting', example: false })
  @IsOptional()
  @IsBoolean()
  targetingAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Allow third-party data sharing', example: false })
  @IsOptional()
  @IsBoolean()
  thirdPartySharingAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Retention period in days', example: 90, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  retentionDays?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
