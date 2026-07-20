import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchIndexJob } from './entities/search-index-job.entity';
import { SearchLog } from './entities/search-log.entity';
import { InterestSignal } from './entities/interest-signal.entity';
import { RankingModel } from './entities/ranking-model.entity';
import { RankingResult } from './entities/ranking-result.entity';
import { SearchIndexJobController } from './controllers/search-index-job.controller';
import { SearchLogController } from './controllers/search-log.controller';
import { InterestSignalController } from './controllers/interest-signal.controller';
import { RankingEngineController } from './controllers/ranking-engine.controller';
import { SearchIndexJobService } from './services/search-index-job.service';
import { SearchLogService } from './services/search-log.service';
import { InterestSignalService } from './services/interest-signal.service';
import { RankingEngineService } from './services/ranking-engine.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SearchIndexJob,
      SearchLog,
      InterestSignal,
      RankingModel,
      RankingResult,
    ]),
  ],
  controllers: [
    SearchIndexJobController,
    SearchLogController,
    InterestSignalController,
    RankingEngineController,
  ],
  providers: [
    SearchIndexJobService,
    SearchLogService,
    InterestSignalService,
    RankingEngineService,
  ],
  exports: [InterestSignalService, RankingEngineService],
})
export class SearchModule {}
