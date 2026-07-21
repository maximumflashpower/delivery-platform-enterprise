import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVictimCaseDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() userId: string;
  @ApiProperty({ enum: ['harassment', 'threats', 'identity_theft', 'doxxing', 'impersonation', 'other'] })
  @IsEnum(['harassment', 'threats', 'identity_theft', 'doxxing', 'impersonation', 'other'])
  caseType: string;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isUrgent?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() safetyPlan?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() evidenceReferences?: string;
}
