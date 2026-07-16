import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchIndexJob } from './entities/search-index-job.entity';
import { SearchLog } from './entities/search-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchIndexJob, SearchLog])],
  exports: [TypeOrmModule],
})
export class SearchModule {}
