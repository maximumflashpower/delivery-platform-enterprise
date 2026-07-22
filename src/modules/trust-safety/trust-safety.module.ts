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
import { ContextFirewallRule } from './entities/context-firewall-rule.entity';
import { ContextFilterLog } from './entities/context-filter-log.entity';
import { AgentContextProfile } from './entities/agent-context-profile.entity';
import { DamageRecordService } from './services/damage-record.service';
import { RiskAssessmentService } from './services/risk-assessment.service';
import { ExceptionRecordService } from './services/exception-record.service';
import { ModerationQueueService } from './services/moderation-queue.service';
import { ReasonCodeService } from './services/reason-code.service';
import { AgentSecurityTestService } from './services/agent-security-test.service';
import { AgentToolInventoryService } from './services/agent-tool-inventory.service';
import { ContextFirewallService } from './services/context-firewall.service';
import { DamageRecordController } from './controllers/damage-record.controller';
import { RiskAssessmentController } from './controllers/risk-assessment.controller';
import { ExceptionRecordController } from './controllers/exception-record.controller';
import { ModerationQueueController } from './controllers/moderation-queue.controller';
import { ReasonCodeController } from './controllers/reason-code.controller';
import { AgentSecurityTestController } from './controllers/agent-security-test.controller';
import { AgentToolInventoryController } from './controllers/agent-tool-inventory.controller';
import { ContextFirewallController } from './controllers/context-firewall.controller';

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
      ContextFirewallRule,
      ContextFilterLog,
      AgentContextProfile,
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
    ContextFirewallController,
  ],
  providers: [
    DamageRecordService,
    RiskAssessmentService,
    ExceptionRecordService,
    ModerationQueueService,
    ReasonCodeService,
    AgentSecurityTestService,
    AgentToolInventoryService,
    ContextFirewallService,
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
    ContextFirewallService,
  ],
})
export class TrustSafetyModule {}
