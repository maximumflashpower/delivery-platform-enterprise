import { IsString, IsEnum, IsOptional, IsUUID, IsNumber, IsArray, IsObject, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreativeCategory, ListingStatus } from '../entities/creative-listing.entity';

export class CreateListingDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: CreativeCategory })
  @IsEnum(CreativeCategory)
  category: CreativeCategory;

  @ApiProperty()
  @IsUUID()
  creatorId: string;

  @ApiProperty()
  @IsString()
  creatorName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  portfolioItems?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  deliverables?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ default: 3 })
  @IsOptional()
  @IsInt()
  revisionLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  estimatedDeliveryDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  pricingTiers?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  merchantId?: string;
}

export class UpdateListingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ListingStatus })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  portfolioItems?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  deliverables?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  revisionLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  acceptingOrders?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  pricingTiers?: Record<string, any>[];
}

export class BookListingDto {
  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiProperty()
  @IsString()
  clientName: string;

  @ApiProperty()
  @IsString()
  projectBrief: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  requirements?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  selectedTier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  agreedPrice?: number;
}

export class SubmitReviewDto {
  @ApiProperty()
  @IsUUID()
  reviewerId: string;

  @ApiProperty()
  @IsString()
  reviewerName: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  rating: number;

  @ApiProperty()
  @IsString()
  comment: string;
}
