import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './entities/configuration.entity';
import { ConfigurationHistory } from './entities/configuration-history.entity';
import { ConfigurationService } from './services/configuration.service';
import { ConfigurationController } from './controllers/configuration.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration, ConfigurationHistory])],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [TypeOrmModule],
})
export class ConfigurationModule {}
