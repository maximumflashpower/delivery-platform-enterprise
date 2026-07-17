import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';
import { AnalyticsReport } from './entities/analytics-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnalyticsEvent,
      AnalyticsReport,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class AnalyticsModule {}
