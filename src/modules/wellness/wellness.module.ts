import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WellnessGoal } from './entities/wellness-goal.entity';
import { WellnessActivity } from './entities/wellness-activity.entity';
import { WellnessGoalService } from './services/wellness-goal.service';
import { WellnessGoalController } from './controllers/wellness-goal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WellnessGoal, WellnessActivity])],
  controllers: [WellnessGoalController],
  providers: [WellnessGoalService],
  exports: [TypeOrmModule],
})
export class WellnessModule {}
