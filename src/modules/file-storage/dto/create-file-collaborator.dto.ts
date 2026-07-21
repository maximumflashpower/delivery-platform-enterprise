import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileCollaboratorDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() fileId: string;
  @ApiProperty() @IsUUID() @IsNotEmpty() userId: string;
  @ApiPropertyOptional({ enum: ['owner', 'editor', 'commenter', 'viewer'], default: 'viewer' })
  @IsEnum(['owner', 'editor', 'commenter', 'viewer']) @IsOptional() role?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() invitedBy?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() permissions?: string;
}
