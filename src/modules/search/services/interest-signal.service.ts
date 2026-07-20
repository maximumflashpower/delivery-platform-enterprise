import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestSignal, SignalType, SignalSource } from '../entities/interest-signal.entity';

@Injectable()
export class InterestSignalService {
  constructor(
    @InjectRepository(InterestSignal)
    private readonly repo: Repository<InterestSignal>,
  ) {}

  async record(
    userId: string,
    entityId: string,
    entityType: string,
    signalType: SignalType,
    source?: SignalSource,
    weight?: number,
    context?: string,
    dwellTime?: number,
    ratingValue?: string,
    searchText?: string
  ): Promise<InterestSignal> {
    const signal = this.repo.create({
      userId,
      entityId,
      entity_type: entityType,
      signal_type: signalType,
      signal_source: source || SignalSource.ORGANIC,
      weight: weight || 1.0,
      context,
      dwell_time_seconds: dwellTime,
      rating_value: ratingValue,
      search_query_text: searchText
    });

    return this.repo.save(signal);
  }

  async findByUser(userId: string, limit = 100): Promise<InterestSignal[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async findByEntity(entityId: string, limit = 50): Promise<InterestSignal[]> {
    return this.repo.find({
      where: { entityId },
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async getUserSignalProfile(userId: string): Promise<Record<string, number>> {
    const signals = await this.repo.find({ where: { userId } });
    const profile: Record<string, number> = {};

    for (const s of signals) {
      const key = `${s.entity_type}:${s.signal_type}`;
      profile[key] = (profile[key] || 0) + s.weight;
    }

    return profile;
  }

  async getEntityPopularity(entityId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('s')
      .select('SUM(s.weight)', 'total')
      .where('s.entityId = :entityId', { entityId })
      .getRawOne();

    return result?.total ? parseFloat(result.total) : 0;
  }
}
