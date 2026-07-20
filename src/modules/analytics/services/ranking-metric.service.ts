import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankingMetric, MetricType } from '../entities/ranking-metric.entity';

@Injectable()
export class RankingMetricService {
  constructor(
    @InjectRepository(RankingMetric)
    private readonly repo: Repository<RankingMetric>,
  ) {}

  async record(modelId: string, type: MetricType, value: number, previousValue?: number, notes?: string): Promise<RankingMetric> {
    const delta = previousValue !== undefined ? value - previousValue : 0;
    const metric = this.repo.create({
      modelId,
      metric_type: type,
      value,
      previous_value: previousValue,
      delta,
      notes
    });
    return this.repo.save(metric);
  }

  async findByModel(modelId: string, type?: MetricType): Promise<RankingMetric[]> {
    const query = this.repo.createQueryBuilder('m')
      .where('m.modelId = :modelId', { modelId })
      .orderBy('m.createdAt', 'DESC');

    if (type) {
      query.andWhere('m.metric_type = :type', { type });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<RankingMetric> {
    const metric = await this.repo.findOne({ where: { id } });
    if (!metric) throw new NotFoundException(`Metric ${id} not found`);
    return metric;
  }

  async getLatest(modelId: string, type: MetricType): Promise<RankingMetric | null> {
    return this.repo.findOne({
      where: { modelId, metric_type: type },
      order: { createdAt: 'DESC' }
    });
  }
}
