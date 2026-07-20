import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsDate, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BallotMethod {
  simple = 'simple',
  majority = 'majority',
  supermajority = 'supermajority',
  ranked_choice = 'ranked_choice',
  approval = 'approval',
}

export class CreateBallotDto {
  @ApiProperty({ description: 'Assembly ID' })
  @IsUUID()
  @IsNotEmpty()
  assemblyId: string;

  @ApiProperty({ description: 'Ballot name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: BallotMethod, default: BallotMethod.simple })
  @IsEnum(BallotMethod)
  @IsOptional()
  method?: BallotMethod;

  @ApiProperty({ description: 'Minimum choices', default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  minChoices?: number;

  @ApiProperty({ description: 'Maximum choices', default: 1 })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxChoices?: number;

  @ApiProperty({ description: 'Ballot opens at', required: false })
  @IsDate()
  @IsOptional()
  opensAt?: Date;

  @ApiProperty({ description: 'Ballot closes at', required: false })
  @IsDate()
  @IsOptional()
  closesAt?: Date;
}
