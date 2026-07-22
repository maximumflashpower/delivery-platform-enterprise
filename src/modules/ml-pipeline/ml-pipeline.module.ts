import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelVersion } from './entities/model-version.entity';
import { PredictionLog } from './entities/prediction-log.entity';
import { SyntheticContentMarking } from './entities/synthetic-content-marking.entity';
import { ModelVersionService } from './services/model-version.service';
import { SyntheticContentMarkingService } from './services/synthetic-content-marking.service';
import { ModelVersionController } from './controllers/model-version.controller';
import { SyntheticContentMarkingController } from './controllers/synthetic-content-marking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModelVersion, PredictionLog, SyntheticContentMarking])],
  controllers: [ModelVersionController, SyntheticContentMarkingController],
  providers: [ModelVersionService, SyntheticContentMarkingService],
  exports: [TypeOrmModule, SyntheticContentMarkingService],
})
export class MLPipelineModule {}
