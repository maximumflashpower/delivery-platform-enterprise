import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppealStatusDto {
  @ApiPropertyOptional({ enum: ['submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'] })
  @IsEnum(['submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'])
  @IsOptional() status?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() reviewerId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() reviewerDecision?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() outcomeExplanation?: string;
}
