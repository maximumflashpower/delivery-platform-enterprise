import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from '../entities/script.entity';
import { ScriptService } from '../services/script.service';
import { ScriptEditorController } from './script-editor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Script])],
  controllers: [ScriptEditorController],
  providers: [ScriptService],
  exports: [],
})
export class ScriptEditorModule {}
