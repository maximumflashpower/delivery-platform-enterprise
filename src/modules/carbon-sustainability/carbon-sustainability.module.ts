import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonCredit } from './entities/carbon-credit.entity';
import { SustainabilityMetric } from './entities/sustainability-metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarbonCredit, SustainabilityMetric])],
  exports: [TypeOrmModule],
})
export class CarbonSustainabilityModule {}
