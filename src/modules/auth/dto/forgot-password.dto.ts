import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: '+525512345678' })
  @IsString()
  @MinLength(10)
  identifier: string;
}
