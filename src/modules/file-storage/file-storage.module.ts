import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredFile } from './entities/stored-file.entity';
import { FileBucket } from './entities/file-bucket.entity';
import { FileEditorDraft } from './entities/file-editor-draft.entity';
import { MultiFormatPublication } from './entities/multi-format-publication.entity';
import { FileVersion } from './entities/file-version.entity';
import { FileCollaborator } from './entities/file-collaborator.entity';
import { FileRights } from './entities/file-rights.entity';
import { StoredFileService } from './services/stored-file.service';
import { EditorDraftService } from './services/editor-draft.service';
import { FileVersionService } from './services/file-version.service';
import { FileCollaboratorService } from './services/file-collaborator.service';
import { FileRightsService } from './services/file-rights.service';
import { StoredFileController } from './controllers/stored-file.controller';
import { EditorDraftController } from './controllers/editor-draft.controller';
import { FileVersionController } from './controllers/file-version.controller';
import { FileCollaboratorController } from './controllers/file-collaborator.controller';
import { FileRightsController } from './controllers/file-rights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    StoredFile,
    FileBucket,
    FileEditorDraft,
    MultiFormatPublication,
    FileVersion,
    FileCollaborator,
    FileRights,
  ])],
  controllers: [
    StoredFileController,
    EditorDraftController,
    FileVersionController,
    FileCollaboratorController,
    FileRightsController,
  ],
  providers: [
    StoredFileService,
    EditorDraftService,
    FileVersionService,
    FileCollaboratorService,
    FileRightsService,
  ],
  exports: [TypeOrmModule, FileVersionService, FileCollaboratorService, FileRightsService],
})
export class FileStorageModule {}
