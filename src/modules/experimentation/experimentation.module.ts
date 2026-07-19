import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentVariant } from './entities/experiment-variant.entity';
import { ExperimentService } from './services/experiment.service';
import { ExperimentController } from './controllers/experiment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment, ExperimentVariant])],
  controllers: [ExperimentController],
  providers: [ExperimentService],
  exports: [TypeOrmModule],
})
export class ExperimentationModule {}
