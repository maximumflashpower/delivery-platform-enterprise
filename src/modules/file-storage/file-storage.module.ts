import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEditorDraft } from './entities/file-editor-draft.entity';
import { MultiFormatPublication } from './entities/multi-format-publication.entity';
import { StoredFile } from './entities/stored-file.entity';
import { FileBucket } from './entities/file-bucket.entity';
import { StoredFileService } from './services/stored-file.service';
import { EditorDraftService } from './services/editor-draft.service';
import { StoredFileController } from './controllers/stored-file.controller';
import { EditorDraftController } from './controllers/editor-draft.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    StoredFile,
    FileBucket,
    FileEditorDraft,
    MultiFormatPublication,
  ])],
  controllers: [
    StoredFileController,
    EditorDraftController,
  ],
  providers: [
    StoredFileService,
    EditorDraftService,
  ],
  exports: [TypeOrmModule],
})
export class FileStorageModule {}
