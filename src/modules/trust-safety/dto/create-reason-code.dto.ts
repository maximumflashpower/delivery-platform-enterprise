import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReasonCodeDto {
  @ApiProperty() @IsString() @IsNotEmpty() code: string;
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;
  @ApiPropertyOptional({ enum: ['low', 'medium', 'high', 'critical'], default: 'low' })
  @IsEnum(['low', 'medium', 'high', 'critical']) @IsOptional() severity?: string;
  @ApiPropertyOptional({ enum: ['none', 'flag_for_review', 'auto_remove', 'auto_warning', 'auto_ban'], default: 'auto' })
  @IsEnum(['none', 'flag_for_review', 'auto_remove', 'auto_warning', 'auto_ban']) @IsOptional() autoAction?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() guidelines?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() escalationPath?: string;
  @ApiPropertyOptional() @IsInt() @Min(0) @IsOptional() priorityWeight?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
}
