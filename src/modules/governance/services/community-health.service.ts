import { Injectable, NotFoundException } from '@nestjs/common';
import { Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityHealthMetric } from '../entities/community-health-metric.entity';
import { CreateCommunityHealthMetricDto } from '../dto/create-community-health-metric.dto';

@Injectable()
export class CommunityHealthService {
  constructor(
    @InjectRepository(CommunityHealthMetric)
    private readonly metricRepo: Repository<CommunityHealthMetric>,
  ) {}

  async create(dto: CreateCommunityHealthMetricDto): Promise<CommunityHealthMetric> {
    const metric = this.metricRepo.create(dto);
    return this.metricRepo.save(metric);
  }

  async findByCommunity(communityId: string, limit?: number): Promise<CommunityHealthMetric[]> {
    const query = this.metricRepo.createQueryBuilder('metric')
      .where('metric.communityId = :communityId', { communityId })
      .orderBy('metric.recordedAt', 'DESC');
    
    if (limit) {
      query.take(limit);
    }
    
    return query.getMany();
  }

  async latest(communityId: string): Promise<CommunityHealthMetric> {
    const metric = await this.metricRepo.findOne({
      where: { communityId },
      order: { recordedAt: 'DESC' },
    });
    
    if (!metric) throw new NotFoundException(`No metrics found for community ${communityId}`);
    return metric;
  }

  async calculateAndRecord(communityId: string, data: Partial<CommunityHealthMetric>): Promise<CommunityHealthMetric> {
    const metric = this.metricRepo.create({
      communityId,
      recordedAt: new Date(),
      ...data,
    });
    
    return this.metricRepo.save(metric);
  }

  async getTrend(communityId: string, days: number = 30): Promise<CommunityHealthMetric[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.metricRepo.find({
      where: {
        communityId,
        recordedAt: Between(startDate, new Date()),
      },
      order: { recordedAt: 'ASC' },
    });
  }
}
