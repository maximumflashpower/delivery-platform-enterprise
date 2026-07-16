import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class ErrorResponseDto {
  @ApiProperty({ example: 'error_code', description: 'Código de error' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Internal Server Error', description: 'Mensaje de error' })
  @IsString()
  message: string;

  @ApiProperty({ example: 500, description: 'Código HTTP status' })
  @IsString()
  statusCode: string;

  @ApiProperty({ example: '2026-07-15T14:00:00Z', description: 'Timestamp del error' })
  @IsString()
  @IsOptional()
  timestamp?: string;

  @ApiProperty({ example: '/api/endpoint', description: 'Endpoint donde ocurrió el error' })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({ 
    example: { field: ['validation_error'] }, 
    description: 'Detalles adicionales de validación u otro contexto',
    required: false,
    type: Object 
  })
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  constructor(partial: Partial<ErrorResponseDto>) {
    Object.assign(this, partial);
  }
}
