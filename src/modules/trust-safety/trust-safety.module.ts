import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationBadge } from './entities/verification-badge.entity';
import { TrustScore } from './entities/trust-score.entity';
import { Incident } from './entities/incident.entity';
import { TrustSafetyService } from './services/trust-safety.service';
import { TrustSafetyController } from './controllers/trust-safety.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationBadge, TrustScore, Incident])],
  providers: [TrustSafetyService],
  controllers: [TrustSafetyController],
  exports: [TypeOrmModule, TrustSafetyService],
})
export class TrustSafetyModule {}
