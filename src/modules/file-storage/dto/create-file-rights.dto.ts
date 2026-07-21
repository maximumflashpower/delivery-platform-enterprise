import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileRightsDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() fileId: string;
  @ApiProperty() @IsUUID() @IsNotEmpty() rightsHolderId: string;
  @ApiProperty({ enum: ['copyright', 'creative-commons', 'public-domain', 'proprietary', 'open-source'] })
  @IsEnum(['copyright', 'creative-commons', 'public-domain', 'proprietary', 'open-source'])
  @IsNotEmpty() rightsType: string;
  @ApiPropertyOptional() @IsString() @IsOptional() license?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() licenseUrl?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() validFrom?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() validUntil?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() usageRestrictions?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() attributionRequired?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() commercialUseAllowed?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() modificationsAllowed?: boolean;
}
