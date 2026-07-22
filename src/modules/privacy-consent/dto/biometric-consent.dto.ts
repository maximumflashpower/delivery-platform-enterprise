import { IsString, IsUUID, IsOptional, IsIn, IsDateString } from 'class-validator';

export class GiveBiometricConsentDto {
  @IsUUID()
  userId: string;

  @IsIn(['voice', 'image', 'facial_features', 'voice_print', 'combined'])
  biometricType: string;

  @IsOptional()
  @IsString()
  consentText?: string;

  @IsOptional()
  @IsIn(['self_upload', 'admin_capture', 'third_party', 'api_import'])
  captureMethod?: string;

  @IsOptional()
  @IsIn(['research', 'development', 'production', 'testing'])
  usageContext?: string;

  @IsOptional()
  @IsString()
  purposeDescription?: string;

  @IsOptional()
  @IsIn(['none', '30_days', '90_days', '1_year', 'permanent'])
  retentionPeriod?: string;
}

export class RevokeBiometricConsentDto {
  @IsUUID()
  userId: string;

  @IsIn(['voice', 'image', 'facial_features', 'voice_print', 'combined'])
  biometricType: string;

  @IsOptional()
  @IsString()
  revocationReason?: string;
}

export class CheckConsentDto {
  @IsUUID()
  userId: string;

  @IsIn(['voice', 'image', 'facial_features', 'voice_print', 'combined'])
  biometricType: string;
}
