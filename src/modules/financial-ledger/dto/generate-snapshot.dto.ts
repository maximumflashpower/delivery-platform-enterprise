import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GenerateSnapshotDto {
  @ApiProperty({ description: 'Date to snapshot', example: '2026-07-21' })
  @IsDateString()
  snapshotDate: string;

  @ApiProperty({ description: 'Include payment method breakdown', default: true, required: false })
  @IsOptional()
  includePaymentMethods?: boolean = true;

  @ApiProperty({ description: 'Domains to include', required: false })
  @IsOptional()
  domains?: string[];
}
