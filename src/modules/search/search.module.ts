import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchIndexJob } from './entities/search-index-job.entity';
import { SearchLog } from './entities/search-log.entity';
import { SearchIndexJobService } from './services/search-index-job.service';
import { SearchLogService } from './services/search-log.service';
import { SearchIndexJobController } from './controllers/search-index-job.controller';
import { SearchLogController } from './controllers/search-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SearchIndexJob, SearchLog])],
  controllers: [SearchIndexJobController, SearchLogController],
  providers: [SearchIndexJobService, SearchLogService],
  exports: [TypeOrmModule, SearchIndexJobService, SearchLogService],
})
export class SearchModule {}
