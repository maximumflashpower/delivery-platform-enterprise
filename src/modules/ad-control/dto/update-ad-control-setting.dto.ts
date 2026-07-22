import { PartialType } from '@nestjs/swagger';
import { CreateAdControlSettingDto } from './create-ad-control-setting.dto';

export class UpdateAdControlSettingDto extends PartialType(CreateAdControlSettingDto) {}
