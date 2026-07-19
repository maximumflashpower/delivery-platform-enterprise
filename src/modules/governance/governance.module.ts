import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovernancePolicy } from './entities/governance-policy.entity';
import { ComplianceRecord } from './entities/compliance-record.entity';
import { GovernancePolicyService } from './services/governance-policy.service';
import { GovernancePolicyController } from './controllers/governance-policy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GovernancePolicy, ComplianceRecord])],
  controllers: [GovernancePolicyController],
  providers: [GovernancePolicyService],
  exports: [TypeOrmModule],
})
export class GovernanceModule {}
