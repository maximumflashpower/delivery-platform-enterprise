import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppealDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() claimId: string;
  @ApiProperty() @IsUUID() @IsNotEmpty() userId: string;
  @ApiProperty({ enum: ['content_removal', 'account_action', 'policy_violation', 'false_report', 'other'] })
  @IsEnum(['content_removal', 'account_action', 'policy_violation', 'false_report', 'other'])
  appealType: string;
  @ApiProperty() @IsString() @IsNotEmpty() groundsForAppeal: string;
  @ApiPropertyOptional() @IsString() @IsOptional() additionalEvidence?: string;
  @ApiPropertyOptional() @IsInt() @Min(1) @IsOptional() version?: number;
}
