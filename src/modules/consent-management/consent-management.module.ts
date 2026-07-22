import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentManagementController } from './controllers/consent-management.controller';
import { ConsentManagementService } from './services/consent-management.service';
import { Consent } from './entities/consent.entity';
import { UserPreference } from './entities/user-preference.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { ConsentHistory } from './entities/consent-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consent, UserPreference, NotificationPreference, ConsentHistory]),
  ],
  controllers: [ConsentManagementController],
  providers: [ConsentManagementService],
  exports: [ConsentManagementService],
})
export class ConsentManagementModule {}
