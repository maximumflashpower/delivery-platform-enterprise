import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payout } from './entities/payout.entity';
import { SponsorSplit } from './entities/sponsor-split.entity';
import { SplitParticipant } from './entities/split-participant.entity';
import { SponsorRiskAssessment } from './entities/sponsor-risk-assessment.entity';
import { PayoutService } from './services/payout.service';
import { SplitService } from './services/split.service';
import { PayoutController } from './controllers/payout.controller';
import { SplitController } from './controllers/split.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payout, SponsorSplit, SplitParticipant, SponsorRiskAssessment])],
  controllers: [PayoutController, SplitController],
  providers: [PayoutService, SplitService],
  exports: [TypeOrmModule, PayoutService, SplitService],
})
export class PayoutModule {}
