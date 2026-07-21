import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DamageRecord } from './entities/damage-record.entity';
import { RiskAssessment } from './entities/risk-assessment.entity';
import { ExceptionRecord } from './entities/exception-record.entity';
import { ModerationQueueItem } from './entities/moderation-queue-item.entity';
import { ReasonCode } from './entities/reason-code.entity';
import { DamageRecordService } from './services/damage-record.service';
import { RiskAssessmentService } from './services/risk-assessment.service';
import { ExceptionRecordService } from './services/exception-record.service';
import { ModerationQueueService } from './services/moderation-queue.service';
import { ReasonCodeService } from './services/reason-code.service';
import { DamageRecordController } from './controllers/damage-record.controller';
import { RiskAssessmentController } from './controllers/risk-assessment.controller';
import { ExceptionRecordController } from './controllers/exception-record.controller';
import { ModerationQueueController } from './controllers/moderation-queue.controller';
import { ReasonCodeController } from './controllers/reason-code.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DamageRecord,
      RiskAssessment,
      ExceptionRecord,
      ModerationQueueItem,
      ReasonCode,
    ]),
  ],
  controllers: [
    DamageRecordController,
    RiskAssessmentController,
    ExceptionRecordController,
    ModerationQueueController,
    ReasonCodeController,
  ],
  providers: [
    DamageRecordService,
    RiskAssessmentService,
    ExceptionRecordService,
    ModerationQueueService,
    ReasonCodeService,
  ],
  exports: [
    DamageRecordService,
    RiskAssessmentService,
    ExceptionRecordService,
    ModerationQueueService,
    ReasonCodeService,
  ],
})
export class TrustSafetyModule {}
