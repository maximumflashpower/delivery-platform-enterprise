import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = unknown> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ required: false, type: Object })
  data?: T;

  @ApiProperty({ example: '2026-07-16T00:00:00.000Z' })
  timestamp: string;

  constructor(partial: Partial<SuccessResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
