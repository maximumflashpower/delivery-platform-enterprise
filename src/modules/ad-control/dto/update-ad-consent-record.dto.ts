import { PartialType } from '@nestjs/swagger';
import { CreateAdConsentRecordDto } from './create-ad-consent-record.dto';

export class UpdateAdConsentRecordDto extends PartialType(CreateAdConsentRecordDto) {}
