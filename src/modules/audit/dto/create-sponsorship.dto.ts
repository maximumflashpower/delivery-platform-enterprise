import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateSponsorshipDto {
  @ApiProperty({ description: 'Sponsor ID' })
  @IsString()
  sponsorId: string;

  @ApiProperty({ description: 'Sponsor name' })
  @IsString()
  @MaxLength(255)
  sponsorName: string;

  @ApiProperty({ description: 'Beneficiary ID' })
  @IsString()
  beneficiaryId: string;

  @ApiProperty({ description: 'Beneficiary name' })
  @IsString()
  @MaxLength(255)
  beneficiaryName: string;

  @ApiPropertyOptional({ description: 'Sponsorship type' })
  @IsOptional()
  @IsString()
  sponsorshipType?: string;

  @ApiPropertyOptional({ description: 'Agreement value' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  agreementValue?: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Disclosure text' })
  @IsOptional()
  @IsString()
  disclosureText?: string;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Terms URL' })
  @IsOptional()
  @IsString()
  termsUrl?: string;

  @ApiPropertyOptional({ description: 'Associated campaign ID' })
  @IsOptional()
  @IsString()
  campaignId?: string;
}
