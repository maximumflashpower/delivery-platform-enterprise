import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSourceAuthorityDto {
  @IsString()
  @IsNotEmpty()
  authorityKey: string;

  @IsString()
  @IsNotEmpty()
  authorityName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  authorityType?: string;

  @IsString()
  @IsOptional()
  verificationStatus?: string;

  @IsString()
  @IsOptional()
  endpointUrl?: string;

  @IsString()
  @IsOptional()
  apiKeyRef?: string;

  @IsString()
  @IsOptional()
  certificateFingerprint?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  metadata?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  trustLevel?: string;
}
