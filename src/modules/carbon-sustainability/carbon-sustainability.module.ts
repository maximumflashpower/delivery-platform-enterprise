import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonCredit } from './entities/carbon-credit.entity';
import { SustainabilityMetric } from './entities/sustainability-metric.entity';
import { CarbonCreditService } from './services/carbon-credit.service';
import { CarbonCreditController } from './controllers/carbon-credit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarbonCredit, SustainabilityMetric])],
  controllers: [CarbonCreditController],
  providers: [CarbonCreditService],
  exports: [TypeOrmModule],
})
export class CarbonSustainabilityModule {}
