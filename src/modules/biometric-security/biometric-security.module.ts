import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiometricUsageLog } from './entities/biometric-usage-log.entity';
import { BiometricDataCatalog } from './entities/biometric-data-catalog.entity';
import { BiometricVerificationService } from './services/biometric-verification.service';
import { BiometricVerificationController } from './controllers/biometric-verification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BiometricUsageLog, BiometricDataCatalog])],
  controllers: [BiometricVerificationController],
  providers: [BiometricVerificationService],
  exports: [TypeOrmModule, BiometricVerificationService],
})
export class BiometricSecurityModule {}
