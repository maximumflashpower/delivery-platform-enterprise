import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, MaxLength, Min } from 'class-validator';

export class CreateAdCampaignDto {
  @ApiProperty({ description: 'Campaign name' })
  @IsString()
  @MaxLength(255)
  campaignName: string;

  @ApiProperty({ description: 'Advertiser ID' })
  @IsString()
  advertiserId: string;

  @ApiProperty({ description: 'Advertiser name' })
  @IsString()
  @MaxLength(255)
  advertiserName: string;

  @ApiProperty({ description: 'Campaign type', enum: ['product', 'political', 'issue', 'sponsorship', 'promotional'] })
  @IsString()
  campaignType: string;

  @ApiPropertyOptional({ description: 'Total budget' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalBudget?: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Target audience' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Is political ad', default: false })
  @IsOptional()
  @IsBoolean()
  isPolitical?: boolean;
}
