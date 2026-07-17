import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessibilityProfile } from './entities/accessibility-profile.entity';
import { AccessibilitySetting } from './entities/accessibility-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessibilityProfile, AccessibilitySetting])],
  exports: [TypeOrmModule],
})
export class AccessibilityModule {}
