import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { TrustScore } from './entities/trust-score.entity';
import { VerificationBadge } from './entities/verification-badge.entity';
import { DamageRecord } from './entities/damage-record.entity';
import { RiskAssessment } from './entities/risk-assessment.entity';
import { ExceptionRecord } from './entities/exception-record.entity';
import { TrustSafetyController } from './controllers/trust-safety.controller';
import { DamageRecordController } from './controllers/damage-record.controller';
import { RiskAssessmentController } from './controllers/risk-assessment.controller';
import { ExceptionRecordController } from './controllers/exception-record.controller';
import { TrustSafetyService } from './services/trust-safety.service';
import { DamageRecordService } from './services/damage-record.service';
import { RiskAssessmentService } from './services/risk-assessment.service';
import { ExceptionRecordService } from './services/exception-record.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Incident,
      TrustScore,
      VerificationBadge,
      DamageRecord,
      RiskAssessment,
      ExceptionRecord,
    ]),
  ],
  controllers: [
    TrustSafetyController,
    DamageRecordController,
    RiskAssessmentController,
    ExceptionRecordController,
  ],
  providers: [
    TrustSafetyService,
    DamageRecordService,
    RiskAssessmentService,
    ExceptionRecordService,
  ],
  exports: [DamageRecordService, RiskAssessmentService, ExceptionRecordService],
})
export class TrustSafetyModule {}
