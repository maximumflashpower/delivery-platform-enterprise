import { IsString, IsNotEmpty, IsDate, IsOptional, IsBoolean, IsEnum, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AssemblyStatus {
  draft = 'draft',
  scheduled = 'scheduled',
  active = 'active',
  completed = 'completed',
  cancelled = 'cancelled',
}

export enum AssemblyType {
  general = 'general',
  emergency = 'emergency',
  budget = 'budget',
  amendment = 'amendment',
  election = 'election',
}

export class CreateAssemblyDto {
  @ApiProperty({ description: 'Assembly title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Assembly description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Scheduled start time' })
  @IsDate()
  scheduledStart: Date;

  @ApiProperty({ description: 'Scheduled end time', required: false })
  @IsDate()
  @IsOptional()
  scheduledEnd?: Date;

  @ApiProperty({ enum: AssemblyStatus, default: AssemblyStatus.draft })
  @IsEnum(AssemblyStatus)
  @IsOptional()
  status?: AssemblyStatus;

  @ApiProperty({ enum: AssemblyType, default: AssemblyType.general })
  @IsEnum(AssemblyType)
  @IsOptional()
  type?: AssemblyType;

  @ApiProperty({ description: 'Community ID', required: false })
  @IsUUID()
  @IsOptional()
  communityId?: string;

  @ApiProperty({ description: 'Allows remote voting', default: true })
  @IsBoolean()
  @IsOptional()
  allowsRemoteVoting?: boolean;

  @ApiProperty({ description: 'Requires quorum', default: false })
  @IsBoolean()
  @IsOptional()
  requiresQuorum?: boolean;

  @ApiProperty({ description: 'Quorum percentage (0-100)', default: 50 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  quorumPercentage?: number;
}
