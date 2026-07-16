import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationBadge } from './entities/verification-badge.entity';
import { TrustScore } from './entities/trust-score.entity';
import { Incident } from './entities/incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationBadge, TrustScore, Incident])],
  exports: [TypeOrmModule],
})
export class TrustSafetyModule {}
