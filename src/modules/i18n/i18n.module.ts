import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { TranslationKey } from './entities/translation-key.entity';
import { Translation } from './entities/translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Language,
      TranslationKey,
      Translation,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class I18nModule {}
