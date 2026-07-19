import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelVersion } from './entities/model-version.entity';
import { PredictionLog } from './entities/prediction-log.entity';
import { ModelVersionService } from './services/model-version.service';
import { ModelVersionController } from './controllers/model-version.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModelVersion, PredictionLog])],
  controllers: [ModelVersionController],
  providers: [ModelVersionService],
  exports: [TypeOrmModule],
})
export class MLPipelineModule {}
