import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMetric } from './entities/system-metric.entity';
import { AlertRule } from './entities/alert-rule.entity';
import { SystemicRiskIndicator } from './entities/systemic-risk-indicator.entity';
import { RiskCorrelation } from './entities/risk-correlation.entity';
import { RiskIncident } from './entities/risk-incident.entity';
import { AbuseSimulation } from './entities/abuse-simulation.entity';
import { SystemMetricService } from './services/system-metric.service';
import { SystemicRiskService } from './services/systemic-risk.service';
import { AbuseSimulationService } from './services/abuse-simulation.service';
import { SystemMetricController } from './controllers/system-metric.controller';
import { SystemicRiskController } from './controllers/systemic-risk.controller';
import { AbuseSimulationController } from './controllers/abuse-simulation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    SystemMetric,
    AlertRule,
    SystemicRiskIndicator,
    RiskCorrelation,
    RiskIncident,
    AbuseSimulation,
  ])],
  controllers: [SystemMetricController, SystemicRiskController, AbuseSimulationController],
  providers: [SystemMetricService, SystemicRiskService, AbuseSimulationService],
  exports: [TypeOrmModule, AbuseSimulationService],
})
export class AnalyticsObservabilityModule {}
