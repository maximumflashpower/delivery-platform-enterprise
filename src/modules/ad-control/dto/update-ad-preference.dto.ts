import { PartialType } from '@nestjs/swagger';
import { CreateAdPreferenceDto } from './create-ad-preference.dto';

export class UpdateAdPreferenceDto extends PartialType(CreateAdPreferenceDto) {}
