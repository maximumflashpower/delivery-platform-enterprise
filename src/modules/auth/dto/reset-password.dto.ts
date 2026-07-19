import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: '+525512345678' })
  @IsString()
  @MinLength(10)
  identifier: string;

  @ApiProperty({ example: '123456', description: 'OTP code received' })
  @IsString()
  @MinLength(6)
  otp: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
