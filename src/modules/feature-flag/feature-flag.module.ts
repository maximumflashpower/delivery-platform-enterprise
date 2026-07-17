import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';
import { FeatureFlagRollout } from './entities/feature-flag-rollout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeatureFlag,
      FeatureFlagRollout,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class FeatureFlagModule {}
