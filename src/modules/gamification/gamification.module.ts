import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { UserProgress } from './entities/user-progress.entity';
import { AchievementService } from './services/achievement.service';
import { AchievementController } from './controllers/achievement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserProgress])],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [TypeOrmModule],
})
export class GamificationModule {}
