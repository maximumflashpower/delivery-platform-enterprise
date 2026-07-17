import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredFile } from './entities/stored-file.entity';
import { FileBucket } from './entities/file-bucket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoredFile,
      FileBucket,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class FileStorageModule {}
