import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Schedule } from './entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Schedule])],
  exports: [TypeOrmModule],
})
export class SchedulingModule {}
