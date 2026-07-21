import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assembly } from './entities/assembly.entity';
import { Proposal } from './entities/proposal.entity';
import { Vote } from './entities/vote.entity';
import { Ballot } from './entities/ballot.entity';
import { CommunityHealthMetric } from './entities/community-health-metric.entity';
import { ComplianceRecord } from './entities/compliance-record.entity';
import { DomainOwner } from './entities/domain-owner.entity';
import { GovernancePolicy } from './entities/governance-policy.entity';
import { PolicyConsent } from './entities/policy-consent.entity';
import { AssemblyService } from './services/assembly.service';
import { ProposalService } from './services/proposal.service';
import { VoteService } from './services/vote.service';
import { BallotService } from './services/ballot.service';
import { CommunityHealthService } from './services/community-health.service';
import { DomainOwnerService } from './services/domain-owner.service';
import { GovernancePolicyService } from './services/governance-policy.service';
import { PolicyConsentService } from './services/policy-consent.service';
import { AssemblyController } from './controllers/assembly.controller';
import { ProposalController } from './controllers/proposal.controller';
import { VoteController } from './controllers/vote.controller';
import { BallotController } from './controllers/ballot.controller';
import { CommunityHealthController } from './controllers/community-health.controller';
import { DomainOwnerController } from './controllers/domain-owner.controller';
import { GovernancePolicyController } from './controllers/governance-policy.controller';
import { PolicyConsentController } from './controllers/policy-consent.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assembly,
      Proposal,
      Vote,
      Ballot,
      CommunityHealthMetric,
      ComplianceRecord,
      DomainOwner,
      GovernancePolicy,
      PolicyConsent,
    ]),
  ],
  controllers: [
    AssemblyController,
    ProposalController,
    VoteController,
    BallotController,
    CommunityHealthController,
    DomainOwnerController,
    GovernancePolicyController,
    PolicyConsentController,
  ],
  providers: [
    AssemblyService,
    ProposalService,
    VoteService,
    BallotService,
    CommunityHealthService,
    DomainOwnerService,
    GovernancePolicyService,
    PolicyConsentService,
  ],
  exports: [
    AssemblyService,
    ProposalService,
    VoteService,
    BallotService,
    CommunityHealthService,
    DomainOwnerService,
    GovernancePolicyService,
    PolicyConsentService,
  ],
})
export class GovernanceModule {}
