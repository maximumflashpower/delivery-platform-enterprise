import { IsString, IsUUID, IsNumber, IsOptional, IsEnum, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { PolicyType, PolicyStatus } from '../entities/income-protection-policy.entity';

export class CreateIncomeProtectionPolicyDto {
  @IsUUID()
  merchantId: string;

  @IsString()
  policyName: string;

  @IsOptional()
  @IsEnum(PolicyType)
  policyType?: PolicyType;

  @IsOptional()
  @IsUUID()
  partnerId?: string;

  @IsOptional()
  @IsString()
  partnerName?: string;

  @IsNumber()
  @Min(0)
  coverageAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  premiumAmount?: number;

  @IsOptional()
  @IsString()
  premiumFrequency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  deductiblePercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  coveragePercent?: number;

  @IsDateString()
  effectiveDate: string;

  @IsDateString()
  expirationDate: string;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsString()
  conditions?: string;

  @IsOptional()
  @IsNumber()
  waitingPeriodDays?: number;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class FileClaimDto {
  @IsString()
  claimTitle: string;

  @IsString()
  claimDescription: string;

  @IsNumber()
  @Min(0)
  claimedAmount: number;

  @IsDateString()
  incidentDate: string;

  @IsOptional()
  @IsString()
  evidence?: string;
}

export class ReviewClaimDto {
  @IsString()
  reviewNotes: string;

  @IsUUID()
  reviewedBy: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  approvedAmount?: number;
}

export class UpdatePolicyStatusDto {
  @IsEnum(PolicyStatus)
  status: PolicyStatus;
}

export class ListPoliciesQueryDto {
  @IsOptional()
  @IsUUID()
  merchantId?: string;

  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;

  @IsOptional()
  @IsEnum(PolicyType)
  policyType?: PolicyType;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
