import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredFile } from './entities/stored-file.entity';
import { FileBucket } from './entities/file-bucket.entity';
import { StoredFileService } from './services/stored-file.service';
import { StoredFileController } from './controllers/stored-file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoredFile, FileBucket])],
  controllers: [StoredFileController],
  providers: [StoredFileService],
  exports: [TypeOrmModule],
})
export class FileStorageModule {}
