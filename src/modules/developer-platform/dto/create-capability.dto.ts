import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCapabilityDto {
  @IsString()
  @IsNotEmpty()
  capabilityKey: string;

  @IsString()
  @IsNotEmpty()
  capabilityName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  sourceAuthorityId?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  metadata?: string;

  @IsBoolean()
  @IsOptional()
  isCritical?: boolean;

  @IsString()
  @IsOptional()
  ownerDomain?: string;

  @IsString()
  @IsOptional()
  dependencies?: string;
}
