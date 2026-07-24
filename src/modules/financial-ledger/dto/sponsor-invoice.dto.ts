import { IsString, IsEnum, IsOptional, IsUUID, IsNumber, IsDateString, IsArray, IsObject, IsBoolean, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InvoiceStatus, ComplianceStatus } from '../entities/sponsor-invoice.entity';

export class CreateSponsorInvoiceDto {
  @ApiProperty()
  @IsUUID()
  sponsorId: string;

  @ApiProperty()
  @IsString()
  sponsorName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  merchantId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  merchantName?: string;

  @ApiProperty()
  @IsDateString()
  issueDate: Date;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  lineItems?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}

export class UpdateInvoiceStatusDto {
  @ApiProperty()
  @IsString()
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class MarkPaidDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentReference?: string;
}

export class SubmitDisputeDto {
  @ApiProperty()
  @IsString()
  reason: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

export class RunComplianceCheckDto {
  @ApiProperty()
  @IsString()
  @IsEnum(ComplianceStatus)
  complianceStatus: ComplianceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  complianceChecks?: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  approvedBy?: string;
}

export class AddLineItemDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;
}
