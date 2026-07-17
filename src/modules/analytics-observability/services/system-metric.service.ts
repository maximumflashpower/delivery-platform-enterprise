import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemMetric } from '../entities/system-metric.entity';

@Injectable()
export class SystemMetricService {
  constructor(
    @InjectRepository(SystemMetric)
    private readonly metricRepo: Repository<SystemMetric>,
  ) {}

  async findAll(serviceName?: string): Promise<SystemMetric[]> {
    return this.metricRepo.find({ where: serviceName ? { serviceName } as any : {} });
  }

  async findOne(id: string): Promise<SystemMetric | null> {
    return this.metricRepo.findOneBy({ id });
  }

  async create(data: Partial<SystemMetric>): Promise<SystemMetric> {
    const entity = this.metricRepo.create(data);
    return this.metricRepo.save(entity);
  }
}
