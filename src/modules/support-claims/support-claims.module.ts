import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Claim } from './entities/claim.entity';
import { ClaimTicket } from './entities/claim-ticket.entity';
import { ClaimStatusLog } from './entities/claim-status-log.entity';
import { SlaConfig } from './entities/sla-config.entity';
import { ClaimService } from './services/claim.service';
import { ClaimTicketService } from './services/claim-ticket.service';
import { ClaimStatusLogService } from './services/claim-status-log.service';
import { SlaConfigService } from './services/sla-config.service';
import { ClaimController } from './controllers/claim.controller';
import { ClaimTicketController } from './controllers/claim-ticket.controller';
import { ClaimStatusLogController } from './controllers/claim-status-log.controller';
import { SlaConfigController } from './controllers/sla-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Claim, ClaimTicket, ClaimStatusLog, SlaConfig])],
  controllers: [ClaimController, ClaimTicketController, ClaimStatusLogController, SlaConfigController],
  providers: [ClaimService, ClaimTicketService, ClaimStatusLogService, SlaConfigService],
  exports: [TypeOrmModule, ClaimService, ClaimTicketService, ClaimStatusLogService, SlaConfigService],
})
export class SupportClaimsModule {}
