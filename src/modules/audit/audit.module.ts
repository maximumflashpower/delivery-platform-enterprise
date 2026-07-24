import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdCampaign } from './entities/ad-campaign.entity';
import { AdSpendRecord } from './entities/ad-spend-record.entity';
import { SponsorshipRecord } from './entities/sponsorship-record.entity';
import { EvidencePreservation } from './entities/evidence-preservation.entity';
import { AdTransparencyService } from './services/ad-transparency.service';
import { EvidencePreservationService } from './services/evidence-preservation.service';
import { AdTransparencyController } from './controllers/ad-transparency.controller';
import { EvidencePreservationController } from './controllers/evidence-preservation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    AdCampaign,
    AdSpendRecord,
    SponsorshipRecord,
    EvidencePreservation,
  ])],
  controllers: [AdTransparencyController, EvidencePreservationController],
  providers: [AdTransparencyService, EvidencePreservationService],
  exports: [TypeOrmModule, EvidencePreservationService],
})
export class AuditModule {}
