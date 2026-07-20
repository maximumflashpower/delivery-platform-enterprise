import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum VoteChoice {
  yes = 'yes',
  no = 'no',
  abstain = 'abstain',
  blank = 'blank',
}

export class CreateVoteDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Proposal ID' })
  @IsUUID()
  @IsNotEmpty()
  proposalId: string;

  @ApiProperty({ description: 'Ballot ID', required: false })
  @IsUUID()
  @IsOptional()
  ballotId?: string;

  @ApiProperty({ enum: VoteChoice, default: VoteChoice.yes })
  @IsEnum(VoteChoice)
  @IsNotEmpty()
  choice: VoteChoice;

  @ApiProperty({ description: 'Vote weight', default: 1 })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: 'Rationale for vote', required: false })
  @IsString()
  @IsOptional()
  rationale?: string;
}
