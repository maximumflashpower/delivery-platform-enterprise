import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WellnessGoal } from './entities/wellness-goal.entity';
import { WellnessActivity } from './entities/wellness-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WellnessGoal, WellnessActivity])],
  exports: [TypeOrmModule],
})
export class WellnessModule {}
