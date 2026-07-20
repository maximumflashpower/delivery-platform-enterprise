import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacyConsent } from './entities/privacy-consent.entity';
import { DataProcessingRecord } from './entities/data-processing-record.entity';
import { UserDataRequest } from './entities/user-data-request.entity';
import { DynamicPreference } from './entities/dynamic-preference.entity';
import { PrivacyConsentController } from './controllers/privacy-consent.controller';
import { DataProcessingController } from './controllers/data-processing.controller';
import { UserDataRequestController } from './controllers/user-data-request.controller';
import { DynamicPreferenceController } from './controllers/dynamic-preference.controller';
import { PrivacyConsentService } from './services/privacy-consent.service';
import { DataProcessingService } from './services/data-processing.service';
import { UserDataRequestService } from './services/user-data-request.service';
import { DynamicPreferenceService } from './services/dynamic-preference.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PrivacyConsent,
      DataProcessingRecord,
      UserDataRequest,
      DynamicPreference,
    ]),
  ],
  controllers: [
    PrivacyConsentController,
    DataProcessingController,
    UserDataRequestController,
    DynamicPreferenceController,
  ],
  providers: [
    PrivacyConsentService,
    DataProcessingService,
    UserDataRequestService,
    DynamicPreferenceService,
  ],
  exports: [PrivacyConsentService, UserDataRequestService],
})
export class PrivacyConsentModule {}
