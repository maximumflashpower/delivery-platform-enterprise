import { IsString, IsUUID, IsNumber, IsOptional, Min, Max, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommunityHealthMetricDto {
  @ApiProperty({ description: 'Community ID' })
  @IsUUID()
  @IsNotEmpty()
  communityId: string;

  @ApiProperty({ description: 'Total members', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalMembers?: number;

  @ApiProperty({ description: 'Active members', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  activeMembers?: number;

  @ApiProperty({ description: 'Participation rate (%)', default: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  participationRate?: number;

  @ApiProperty({ description: 'Open proposals', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  openProposals?: number;

  @ApiProperty({ description: 'Approved proposals', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  approvedProposals?: number;

  @ApiProperty({ description: 'Trust score', default: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  trustScore?: number;
}
