import { IsString, IsUUID, IsOptional, IsIn } from 'class-validator';

export class CheckBiometricPermissionDto {
  @IsUUID()
  userId: string;

  @IsIn(['voice', 'image', 'facial_features', 'voice_print', 'combined'])
  biometricType: string;

  @IsIn(['training', 'inference', 'verification', 'identification', 'analysis'])
  operationType: string;

  @IsUUID()
  modelId: string;

  @IsString()
  modelName: string;
}

export class LogBiometricUsageDto {
  @IsUUID()
  consentId: string;

  @IsUUID()
  userId: string;

  @IsIn(['voice', 'image', 'facial_features', 'voice_print', 'combined'])
  biometricType: string;

  @IsIn(['training', 'inference', 'verification', 'identification', 'analysis'])
  operationType: string;

  @IsUUID()
  modelId: string;

  @IsString()
  modelName: string;
}

export class ApproveUsageDto {
  @IsUUID()
  logId: string;

  @IsUUID()
  approvedByUserId: string;

  @IsOptional()
  @IsString()
  approvalNotes?: string;
}

export class DenyUsageDto {
  @IsUUID()
  logId: string;

  @IsString()
  reason: string;
}

export class CatalogDataDto {
  @IsUUID()
  userId: string;

  @IsIn(['voice', 'image', 'facial_features', 'voice_print', 'combined'])
  biometricType: string;

  @IsString()
  dataSource: string;

  @IsString()
  storageLocation: string;
}
