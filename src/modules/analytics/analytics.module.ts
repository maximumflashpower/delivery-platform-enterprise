import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AnalyticsReport } from './entities/analytics-report.entity';
import { RankingMetric } from './entities/ranking-metric.entity';
import { AnalyticsEventController } from './controllers/analytics-event.controller';
import { RankingMetricController } from './controllers/ranking-metric.controller';
import { AnalyticsEventService } from './services/analytics-event.service';
import { RankingMetricService } from './services/ranking-metric.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnalyticsEvent,
      AnalyticsReport,
      RankingMetric,
    ]),
  ],
  controllers: [
    AnalyticsEventController,
    RankingMetricController,
  ],
  providers: [
    AnalyticsEventService,
    RankingMetricService,
  ],
  exports: [RankingMetricService],
})
export class AnalyticsModule {}
