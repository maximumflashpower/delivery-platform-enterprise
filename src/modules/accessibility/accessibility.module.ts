import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessibilityProfile } from './entities/accessibility-profile.entity';
import { AccessibilitySetting } from './entities/accessibility-setting.entity';
import { AccessibilityProfileService } from './services/accessibility-profile.service';
import { AccessibilityProfileController } from './controllers/accessibility-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccessibilityProfile, AccessibilitySetting])],
  controllers: [AccessibilityProfileController],
  providers: [AccessibilityProfileService],
  exports: [TypeOrmModule],
})
export class AccessibilityModule {}
