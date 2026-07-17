import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { TranslationKey } from './entities/translation-key.entity';
import { Translation } from './entities/translation.entity';
import { LanguageService } from './services/language.service';
import { LanguageController } from './controllers/language.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Language, TranslationKey, Translation])],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [TypeOrmModule],
})
export class I18nModule {}
