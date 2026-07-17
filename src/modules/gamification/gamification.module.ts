import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { UserProgress } from './entities/user-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserProgress])],
  exports: [TypeOrmModule],
})
export class GamificationModule {}
