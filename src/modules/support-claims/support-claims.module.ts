import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appeal } from './entities/appeal.entity';
import { Claim } from './entities/claim.entity';
import { ClaimTicket } from './entities/claim-ticket.entity';
import { ClaimStatusLog } from './entities/claim-status-log.entity';
import { VictimSupportCase } from './entities/victim-support-case.entity';
import { SlaConfig } from './entities/sla-config.entity';
import { AppealEvidence } from './entities/appeal-evidence.entity';
import { IaDecisionAppeal } from './entities/ia-decision-appeal.entity';
import { AppealService } from './services/appeal.service';
import { ClaimService } from './services/claim.service';
import { ClaimTicketService } from './services/claim-ticket.service';
import { ClaimStatusLogService } from './services/claim-status-log.service';
import { VictimCaseService } from './services/victim-case.service';
import { SlaConfigService } from './services/sla-config.service';
import { AppealEvidenceService } from './services/appeal-evidence.service';
import { IaDecisionAppealService } from './services/ia-decision-appeal.service';
import { AppealController } from './controllers/appeal.controller';
import { ClaimController } from './controllers/claim.controller';
import { ClaimTicketController } from './controllers/claim-ticket.controller';
import { ClaimStatusLogController } from './controllers/claim-status-log.controller';
import { VictimCaseController } from './controllers/victim-case.controller';
import { SlaConfigController } from './controllers/sla-config.controller';
import { AppealEvidenceController } from './controllers/appeal-evidence.controller';
import { IaDecisionAppealController } from './controllers/ia-decision-appeal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appeal,
      Claim,
      ClaimTicket,
      ClaimStatusLog,
      VictimSupportCase,
      SlaConfig,
      AppealEvidence,
      IaDecisionAppeal,
    ]),
  ],
  controllers: [
    AppealController,
    ClaimController,
    ClaimTicketController,
    ClaimStatusLogController,
    VictimCaseController,
    SlaConfigController,
    AppealEvidenceController,
    IaDecisionAppealController,
  ],
  providers: [
    AppealService,
    ClaimService,
    ClaimTicketService,
    ClaimStatusLogService,
    VictimCaseService,
    SlaConfigService,
    AppealEvidenceService,
    IaDecisionAppealService,
  ],
  exports: [
    TypeOrmModule,
    AppealService,
    IaDecisionAppealService,
  ],
})
export class SupportClaimsModule {}
