import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Schedule> {
    const s = await this.scheduleRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!s) throw new NotFoundException(`Schedule with ID ${id} not found`);
    return s;
  }

  async create(data: Partial<Schedule>): Promise<Schedule> {
    if (!data.scheduleCode || !data.name || !data.cronExpression || !data.jobType) {
      throw new BadRequestException('scheduleCode, name, cronExpression, and jobType are required');
    }
    return this.scheduleRepo.save(this.scheduleRepo.create(data));
  }

  async update(id: string, data: Partial<Schedule>): Promise<Schedule> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.scheduleRepo.update(id, data);
    return this.findById(id);
  }

  async activate(id: string): Promise<Schedule> {
    const s = await this.findById(id);
    s.isActive = true;
    return this.scheduleRepo.save(s);
  }

  async deactivate(id: string): Promise<Schedule> {
    const s = await this.findById(id);
    s.isActive = false;
    return this.scheduleRepo.save(s);
  }

  async markRun(id: string, nextRunAt: Date): Promise<Schedule> {
    const s = await this.findById(id);
    s.lastRunAt = new Date();
    s.nextRunAt = nextRunAt;
    return this.scheduleRepo.save(s);
  }
}
