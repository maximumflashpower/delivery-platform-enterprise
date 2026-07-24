import { IsString, IsUUID, IsNumber, IsOptional, IsEnum, IsDate, IsBoolean, IsDecimal, Min, Max, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CostCalculationStatus, CostCategory } from '../entities/production-cost-calculation.entity';

export class CreateProductionCostCalculationDto {
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  productDescription?: string;

  @IsUUID()
  merchantId: string;

  @IsOptional()
  @IsEnum(CostCalculationStatus)
  status?: CostCalculationStatus;

  @IsOptional()
  @IsNumber()
  @Min(1)
  productionQuantity?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}

export class CreateCostLineItemDto {
  @IsUUID()
  calculationId: string;

  @IsString()
  itemName: string;

  @IsOptional()
  @IsString()
  itemDescription?: string;

  @IsEnum(CostCategory)
  category: CostCategory;

  @IsDecimal()
  @Min(0)
  unitCost: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  taxPercent?: number;

  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @IsOptional()
  @IsString()
  vendorSupplier?: string;

  @IsOptional()
  @IsString()
  costType?: string;
}

export class CalculateTotalsDto {
  @IsUUID()
  calculationId: string;
}

export class ReviewCalculationDto {
  @IsString()
  reviewNotes: string;

  @IsUUID()
  reviewedBy: string;
}

export class ApproveCalculationDto {
  @IsUUID()
  approvedBy: string;
}

export class UpdateCalculationStatusDto {
  @IsEnum(CostCalculationStatus)
  status: CostCalculationStatus;
}

export class ListCalculationsQueryDto {
  @IsOptional()
  @IsUUID()
  merchantId?: string;

  @IsOptional()
  @IsEnum(CostCalculationStatus)
  status?: CostCalculationStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
