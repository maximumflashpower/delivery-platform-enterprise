import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AnalyticsReport } from './entities/analytics-report.entity';
import { AnalyticsEventService } from './services/analytics-event.service';
import { AnalyticsEventController } from './controllers/analytics-event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsEvent, AnalyticsReport])],
  controllers: [AnalyticsEventController],
  providers: [AnalyticsEventService],
  exports: [TypeOrmModule],
})
export class AnalyticsModule {}
