import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateModerationStatusDto {
  @ApiPropertyOptional({ enum: ['in_review', 'approved', 'rejected', 'removed', 'escalated'] })
  @IsEnum(['in_review', 'approved', 'rejected', 'removed', 'escalated'])
  @IsOptional() status?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() moderatorId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() moderatorNotes?: string;
  @ApiPropertyOptional({ enum: ['none', 'warning', 'content_removed', 'user_banned', 'suspended', 'reported_authorities'] })
  @IsEnum(['none', 'warning', 'content_removed', 'user_banned', 'suspended', 'reported_authorities'])
  @IsOptional() actionTaken?: string;
}
