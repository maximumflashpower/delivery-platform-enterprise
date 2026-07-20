import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernancePolicy } from './entities/governance-policy.entity';
import { ComplianceRecord } from './entities/compliance-record.entity';
import { DomainOwner } from './entities/domain-owner.entity';
import { PolicyConsent } from './entities/policy-consent.entity';
import { GovernancePolicyController } from './controllers/governance-policy.controller';
import { DomainOwnerController } from './controllers/domain-owner.controller';
import { PolicyConsentController } from './controllers/policy-consent.controller';
import { GovernancePolicyService } from './services/governance-policy.service';
import { DomainOwnerService } from './services/domain-owner.service';
import { PolicyConsentService } from './services/policy-consent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GovernancePolicy,
      ComplianceRecord,
      DomainOwner,
      PolicyConsent,
    ]),
  ],
  controllers: [
    GovernancePolicyController,
    DomainOwnerController,
    PolicyConsentController,
  ],
  providers: [
    GovernancePolicyService,
    DomainOwnerService,
    PolicyConsentService,
  ],
  exports: [PolicyConsentService],
})
export class GovernanceModule {}
