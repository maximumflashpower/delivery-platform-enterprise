import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Schedule } from './entities/schedule.entity';
import { JobService } from './services/job.service';
import { ScheduleService } from './services/schedule.service';
import { JobController } from './controllers/job.controller';
import { ScheduleController } from './controllers/schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Schedule])],
  controllers: [JobController, ScheduleController],
  providers: [JobService, ScheduleService],
  exports: [TypeOrmModule, JobService, ScheduleService],
})
export class SchedulingModule {}
