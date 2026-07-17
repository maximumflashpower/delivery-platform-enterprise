import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './entities/configuration.entity';
import { ConfigurationHistory } from './entities/configuration-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Configuration,
      ConfigurationHistory,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class ConfigurationModule {}
