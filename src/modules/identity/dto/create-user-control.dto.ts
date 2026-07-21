import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserControlDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Type of control (e.g. data_sharing, tracking, ai_decisions)' })
  @IsString()
  @IsNotEmpty()
  controlType: string;

  @ApiPropertyOptional({ enum: ['opt-in', 'opt-out', 'mandatory', 'conditional'], default: 'opt-in' })
  @IsEnum(['opt-in', 'opt-out', 'mandatory', 'conditional'])
  @IsOptional()
  scope?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'JSON conditions' })
  @IsString()
  @IsOptional()
  conditions?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  effectiveFrom?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  effectiveUntil?: string;
}
