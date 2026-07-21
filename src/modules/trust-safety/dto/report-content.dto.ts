import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportContentDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() contentId: string;
  @ApiProperty({ enum: ['post', 'comment', 'message', 'profile', 'file', 'other'] })
  @IsEnum(['post', 'comment', 'message', 'profile', 'file', 'other'])
  contentType: string;
  @ApiProperty() @IsUUID() @IsNotEmpty() reportedByUserId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() flaggedUserId?: string;
  @ApiProperty() @IsString() @IsNotEmpty() reasonCode: string;
  @ApiPropertyOptional() @IsString() @IsOptional() reasonDescription?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() evidence?: string;
  @ApiPropertyOptional({ default: 0 }) @IsString() priority?: string;
}
