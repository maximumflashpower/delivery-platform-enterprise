import { IsString, IsEnum, IsOptional, IsInt, IsObject, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SimulationStatus, SimulationType } from '../entities/abuse-simulation.entity';

export class CreateSimulationDto {
  @ApiProperty()
  @IsString()
  simulationName: string;

  @ApiProperty({ enum: SimulationType })
  @IsEnum(SimulationType)
  simulationType: SimulationType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetFunction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  attackVector?: Record<string, any>;

  @ApiPropertyOptional({ default: 100 })
  @IsOptional()
  @IsInt()
  requestCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}

export class UpdateSimulationStatusDto {
  @ApiProperty({ enum: SimulationStatus })
  @IsEnum(SimulationStatus)
  status: SimulationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendations?: string;
}

export class ExecuteSimulationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  iterations?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  delayMs?: number;
}
