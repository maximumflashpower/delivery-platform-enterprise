import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMetric } from './entities/system-metric.entity';
import { AlertRule } from './entities/alert-rule.entity';
import { SystemicRiskIndicator } from './entities/systemic-risk-indicator.entity';
import { RiskCorrelation } from './entities/risk-correlation.entity';
import { RiskIncident } from './entities/risk-incident.entity';
import { SystemMetricService } from './services/system-metric.service';
import { SystemicRiskService } from './services/systemic-risk.service';
import { SystemMetricController } from './controllers/system-metric.controller';
import { SystemicRiskController } from './controllers/systemic-risk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    SystemMetric,
    AlertRule,
    SystemicRiskIndicator,
    RiskCorrelation,
    RiskIncident,
  ])],
  controllers: [SystemMetricController, SystemicRiskController],
  providers: [SystemMetricService, SystemicRiskService],
  exports: [TypeOrmModule, SystemicRiskService],
})
export class AnalyticsObservabilityModule {}
