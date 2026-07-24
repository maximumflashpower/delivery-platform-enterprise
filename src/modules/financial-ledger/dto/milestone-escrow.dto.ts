import { IsString, IsEnum, IsOptional, IsUUID, IsNumber, IsArray, IsObject, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EscrowStatus, MilestoneStatus, PaymentMethod } from '../entities/milestone-escrow.entity';

export class CreateEscrowDto {
  @ApiProperty()
  @IsString()
  escrowName: string;

  @ApiProperty()
  @IsUUID()
  sponsorId: string;

  @ApiProperty()
  @IsUUID()
  recipientId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional({ default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  milestones: Record<string, any>[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  managedBy?: string;
}

export class FundEscrowDto {
  @ApiProperty()
  @IsString()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fundingReference?: string;
}

export class SubmitMilestoneDto {
  @ApiProperty()
  @IsUUID()
  milestoneId: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  deliverables?: Record<string, any>;
}

export class ApproveMilestoneDto {
  @ApiProperty()
  @IsUUID()
  milestoneId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  releaseAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  approvalNotes?: string;
}

export class RejectMilestoneDto {
  @ApiProperty()
  @IsUUID()
  milestoneId: string;

  @ApiProperty()
  @IsString()
  rejectionReason: string;
}

export class RaiseDisputeDto {
  @ApiProperty()
  @IsUUID()
  raisedBy: string;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supportingEvidence?: string;
}

export class ResolveDisputeDto {
  @ApiProperty()
  @IsString()
  resolution: 'sponsor_wins' | 'recipient_wins' | 'partial' | 'refunded';

  @ApiProperty()
  @IsNumber()
  @Min(0)
  settlementAmount: number;

  @ApiProperty()
  @IsString()
  notes: string;
}
