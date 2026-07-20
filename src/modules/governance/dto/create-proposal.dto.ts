import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ProposalCategory {
  informational = 'informational',
  policy = 'policy',
  funding = 'funding',
  structural = 'structural',
  electoral = 'electoral',
}

export enum ProposalStatus {
  draft = 'draft',
  pending = 'pending',
  under_review = 'under_review',
  active = 'active',
  approved = 'approved',
  rejected = 'rejected',
  expired = 'expired',
}

export class CreateProposalDto {
  @ApiProperty({ description: 'Proposal title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Proposal description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ProposalCategory, default: ProposalCategory.informational })
  @IsEnum(ProposalCategory)
  @IsOptional()
  category?: ProposalCategory;

  @ApiProperty({ description: 'Assembly ID' })
  @IsUUID()
  @IsNotEmpty()
  assemblyId: string;

  @ApiProperty({ description: 'Submitted by user ID', required: false })
  @IsString()
  @IsOptional()
  submittedBy?: string;

  @ApiProperty({ description: 'Submission deadline', required: false })
  @IsDate()
  @IsOptional()
  submissionDeadline?: Date;

  @ApiProperty({ description: 'Voting start date', required: false })
  @IsDate()
  @IsOptional()
  votingStartDate?: Date;

  @ApiProperty({ description: 'Voting end date', required: false })
  @IsDate()
  @IsOptional()
  votingEndDate?: Date;
}
