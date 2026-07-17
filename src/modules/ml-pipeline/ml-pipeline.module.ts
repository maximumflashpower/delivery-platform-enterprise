import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelVersion } from './entities/model-version.entity';
import { PredictionLog } from './entities/prediction-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModelVersion, PredictionLog])],
  exports: [TypeOrmModule],
})
export class MLPipelineModule {}
