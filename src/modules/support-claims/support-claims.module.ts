import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Claim } from './entities/claim.entity';
import { ClaimTicket } from './entities/claim-ticket.entity';
import { ClaimStatusLog } from './entities/claim-status-log.entity';
import { SlaConfig } from './entities/sla-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Claim, ClaimTicket, ClaimStatusLog, SlaConfig])],
  exports: [TypeOrmModule],
})
export class SupportClaimsModule {}
