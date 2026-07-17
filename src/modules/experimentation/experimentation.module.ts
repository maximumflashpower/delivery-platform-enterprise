import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entities/experiment.entity';
import { ExperimentVariant } from './entities/experiment-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment, ExperimentVariant])],
  exports: [TypeOrmModule],
})
export class ExperimentationModule {}
