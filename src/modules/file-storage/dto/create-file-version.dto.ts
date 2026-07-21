import { IsString, IsNotEmpty, IsOptional, IsUUID, IsInt, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileVersionDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() fileId: string;
  @ApiProperty() @IsUUID() @IsNotEmpty() createdByUserId: string;
  @ApiProperty() @IsString() @IsNotEmpty() content: string;
  @ApiProperty() @IsString() @IsNotEmpty() format: string;
  @ApiPropertyOptional() @IsString() @IsOptional() changeDescription?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isCurrent?: boolean;
  @ApiPropertyOptional() @IsInt() @Min(0) @IsOptional() sizeBytes?: number;
}
