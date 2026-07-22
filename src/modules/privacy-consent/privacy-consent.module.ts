import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiometricConsent } from './entities/biometric-consent.entity';
import { BiometricConsentService } from './services/biometric-consent.service';
import { BiometricConsentController } from './controllers/biometric-consent.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BiometricConsent])],
  controllers: [BiometricConsentController],
  providers: [BiometricConsentService],
  exports: [TypeOrmModule, BiometricConsentService],
})
export class PrivacyConsentModule {}
