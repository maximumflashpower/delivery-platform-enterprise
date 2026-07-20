import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assembly } from './entities/assembly.entity';
import { Proposal } from './entities/proposal.entity';
import { Vote } from './entities/vote.entity';
import { Ballot } from './entities/ballot.entity';
import { CommunityHealthMetric } from './entities/community-health-metric.entity';
import { AssemblyService } from './services/assembly.service';
import { ProposalService } from './services/proposal.service';
import { VoteService } from './services/vote.service';
import { CommunityHealthService } from './services/community-health.service';
import { AssemblyController } from './controllers/assembly.controller';
import { ProposalController } from './controllers/proposal.controller';
import { VoteController } from './controllers/vote.controller';
import { CommunityHealthController } from './controllers/community-health.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assembly, Proposal, Vote, Ballot, CommunityHealthMetric]),
  ],
  controllers: [
    AssemblyController,
    ProposalController,
    VoteController,
    CommunityHealthController,
  ],
  providers: [
    AssemblyService,
    ProposalService,
    VoteService,
    CommunityHealthService,
  ],
  exports: [
    AssemblyService,
    ProposalService,
    VoteService,
    CommunityHealthService,
  ],
})
export class GovernanceModule {}
