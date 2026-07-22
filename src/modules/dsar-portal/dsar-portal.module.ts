import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DsarPortalController } from './controllers/dsar-portal.controller';
import { DsarPortalService } from './services/dsar-portal.service';
import { DsarRequest } from './entities/dsar-request.entity';
import { DeletionScope } from './entities/deletion-scope.entity';
import { DataExportJob } from './entities/data-export-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DsarRequest, DeletionScope, DataExportJob])],
  controllers: [DsarPortalController],
  providers: [DsarPortalService],
  exports: [DsarPortalService],
})
export class DsarPortalModule {}
