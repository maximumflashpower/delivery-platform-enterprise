import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent } from '../entities/analytics-event.entity';

@Injectable()
export class AnalyticsEventService {
  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly eventRepo: Repository<AnalyticsEvent>,
  ) {}

  async findAll(category?: string): Promise<AnalyticsEvent[]> {
    return this.eventRepo.find({ where: category ? { category: category as any } : {} });
  }

  async findOne(id: string): Promise<AnalyticsEvent | null> {
    return this.eventRepo.findOneBy({ id });
  }

  async create(data: Partial<AnalyticsEvent>): Promise<AnalyticsEvent> {
    const entity = this.eventRepo.create(data);
    return this.eventRepo.save(entity);
  }
}
