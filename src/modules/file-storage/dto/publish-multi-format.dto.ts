import { IsString, IsNotEmpty, IsUUID, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublishMultiFormatDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  draftId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  outputFormats: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  summary?: string;
}
