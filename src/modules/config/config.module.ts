import { Module, Global } from '@nestjs/common';
import { TypeOrmConfigService } from '../../config/typeorm-config.service';

@Global()
@Module({
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
})
export class ConfigModule {}
