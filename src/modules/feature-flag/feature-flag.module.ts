import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';
import { FeatureFlagRollout } from './entities/feature-flag-rollout.entity';
import { FeatureFlagService } from './services/feature-flag.service';
import { FeatureFlagController } from './controllers/feature-flag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlag, FeatureFlagRollout])],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService],
  exports: [TypeOrmModule],
})
export class FeatureFlagModule {}
