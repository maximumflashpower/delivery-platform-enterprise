import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdCampaign } from './entities/ad-campaign.entity';
import { SponsorshipRecord } from './entities/sponsorship-record.entity';
import { AdSpendRecord } from './entities/ad-spend-record.entity';
import { AdTransparencyService } from './services/ad-transparency.service';
import { AdTransparencyController } from './controllers/ad-transparency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdCampaign, SponsorshipRecord, AdSpendRecord])],
  controllers: [AdTransparencyController],
  providers: [AdTransparencyService],
  exports: [TypeOrmModule, AdTransparencyService],
})
export class AuditModule {}
