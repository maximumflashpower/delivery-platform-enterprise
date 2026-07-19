import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMetric } from './entities/system-metric.entity';
import { AlertRule } from './entities/alert-rule.entity';
import { SystemMetricService } from './services/system-metric.service';
import { SystemMetricController } from './controllers/system-metric.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemMetric, AlertRule])],
  controllers: [SystemMetricController],
  providers: [SystemMetricService],
  exports: [TypeOrmModule],
})
export class AnalyticsObservabilityModule {}
