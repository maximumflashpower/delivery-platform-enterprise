import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileEditorDraftDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ enum: ['markdown', 'html', 'rst', 'latex', 'plaintext'], default: 'markdown' })
  @IsEnum(['markdown', 'html', 'rst', 'latex', 'plaintext'])
  @IsOptional()
  format?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  originalFileId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  metadata?: string;
}
