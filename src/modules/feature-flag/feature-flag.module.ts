import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';
import { FeatureFlagRollout } from './entities/feature-flag-rollout.entity';
import { ReleaseGate } from './entities/release-gate.entity';
import { FeatureFlagController } from './controllers/feature-flag.controller';
import { ReleaseGateController } from './controllers/release-gate.controller';
import { FeatureFlagService } from './services/feature-flag.service';
import { ReleaseGateService } from './services/release-gate.service';
import { GovernanceModule } from '../governance/governance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureFlag, FeatureFlagRollout, ReleaseGate]),
    GovernanceModule,
  ],
  controllers: [FeatureFlagController, ReleaseGateController],
  providers: [FeatureFlagService, ReleaseGateService],
  exports: [ReleaseGateService],
})
export class FeatureFlagModule {}
