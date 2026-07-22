import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdPreference } from './entities/ad-preference.entity';
import { AdConsentRecord } from './entities/ad-consent-record.entity';
import { AdControlSetting } from './entities/ad-control-setting.entity';
import { AdPreferenceService } from './services/ad-preference.service';
import { AdConsentService } from './services/ad-consent.service';
import { AdControlSettingService } from './services/ad-control-setting.service';
import { AdPreferenceController } from './controllers/ad-preference.controller';
import { AdConsentController } from './controllers/ad-consent.controller';
import { AdControlSettingController } from './controllers/ad-control-setting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdPreference, AdConsentRecord, AdControlSetting])],
  controllers: [AdPreferenceController, AdConsentController, AdControlSettingController],
  providers: [AdPreferenceService, AdConsentService, AdControlSettingService],
  exports: [AdPreferenceService, AdConsentService, AdControlSettingService],
})
export class AdControlModule {}
