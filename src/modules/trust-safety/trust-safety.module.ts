import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DamageRecord } from './entities/damage-record.entity';
import { RiskAssessment } from './entities/risk-assessment.entity';
import { ExceptionRecord } from './entities/exception-record.entity';
import { ModerationQueueItem } from './entities/moderation-queue-item.entity';
import { ReasonCode } from './entities/reason-code.entity';
import { AgentSecurityTest } from './entities/agent-security-test.entity';
import { AgentSecurityResult } from './entities/agent-security-result.entity';
import { AgentToolInventory } from './entities/agent-tool-inventory.entity';
import { DamageRecordService } from './services/damage-record.service';
import { RiskAssessmentService } from './services/risk-assessment.service';
import { ExceptionRecordService } from './services/exception-record.service';
import { ModerationQueueService } from './services/moderation-queue.service';
import { ReasonCodeService } from './services/reason-code.service';
import { AgentSecurityTestService } from './services/agent-security-test.service';
import { AgentToolInventoryService } from './services/agent-tool-inventory.service';
import { DamageRecordController } from './controllers/damage-record.controller';
import { RiskAssessmentController } from './controllers/risk-assessment.controller';
import { ExceptionRecordController } from './controllers/exception-record.controller';
import { ModerationQueueController } from './controllers/moderation-queue.controller';
import { ReasonCodeController } from './controllers/reason-code.controller';
import { AgentSecurityTestController } from './controllers/agent-security-test.controller';
import { AgentToolInventoryController } from './controllers/agent-tool-inventory.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DamageRecord,
      RiskAssessment,
      ExceptionRecord,
      ModerationQueueItem,
      ReasonCode,
      AgentSecurityTest,
      AgentSecurityResult,
      AgentToolInventory,
    ]),
  ],
  controllers: [
    DamageRecordController,
    RiskAssessmentController,
    ExceptionRecordController,
    ModerationQueueController,
    ReasonCodeController,
    AgentSecurityTestController,
    AgentToolInventoryController,
  ],
  providers: [
    DamageRecordService,
    RiskAssessmentService,
    ExceptionRecordService,
    ModerationQueueService,
    ReasonCodeService,
    AgentSecurityTestService,
    AgentToolInventoryService,
  ],
  exports: [
    TypeOrmModule,
    DamageRecordService,
    RiskAssessmentService,
    ExceptionRecordService,
    ModerationQueueService,
    ReasonCodeService,
    AgentSecurityTestService,
    AgentToolInventoryService,
  ],
})
export class TrustSafetyModule {}
