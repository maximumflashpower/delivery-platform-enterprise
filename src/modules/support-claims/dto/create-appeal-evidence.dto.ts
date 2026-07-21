import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppealEvidenceDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() appealId: string;
  @ApiProperty() @IsUUID() @IsNotEmpty() uploadedByUserId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() fileId?: string;
  @ApiProperty({ enum: ['screenshot', 'document', 'message_log', 'witness_statement', 'other'] })
  @IsEnum(['screenshot', 'document', 'message_log', 'witness_statement', 'other'])
  evidenceType: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isVerified?: boolean;
}
