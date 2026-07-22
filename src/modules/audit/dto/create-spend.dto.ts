import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateAdSpendDto {
  @ApiProperty({ description: 'Campaign ID' })
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'Spend date' })
  @IsString()
  spendDate: string;

  @ApiProperty({ description: 'Amount spent' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Spend category' })
  @IsOptional()
  @IsString()
  spendCategory?: string;

  @ApiPropertyOptional({ description: 'Vendor' })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiPropertyOptional({ description: 'Impressions', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  impressions?: number;

  @ApiPropertyOptional({ description: 'Clicks', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  clicks?: number;

  @ApiPropertyOptional({ description: 'Reach', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reach?: number;
}
