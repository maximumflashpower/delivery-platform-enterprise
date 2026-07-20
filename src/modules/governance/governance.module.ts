import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernancePolicy } from './entities/governance-policy.entity';
import { ComplianceRecord } from './entities/compliance-record.entity';
import { DomainOwner } from './entities/domain-owner.entity';
import { GovernancePolicyController } from './controllers/governance-policy.controller';
import { DomainOwnerController } from './controllers/domain-owner.controller';
import { GovernancePolicyService } from './services/governance-policy.service';
import { DomainOwnerService } from './services/domain-owner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GovernancePolicy, ComplianceRecord, DomainOwner]),
  ],
  controllers: [GovernancePolicyController, DomainOwnerController],
  providers: [GovernancePolicyService, DomainOwnerService],
  exports: [DomainOwnerService],
})
export class GovernanceModule {}
