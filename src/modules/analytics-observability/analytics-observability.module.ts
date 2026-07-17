import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMetric } from './entities/system-metric.entity';
import { AlertRule } from './entities/alert-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemMetric, AlertRule])],
  exports: [TypeOrmModule],
})
export class AnalyticsObservabilityModule {}
