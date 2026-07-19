import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SearchLog } from '../entities/search-log.entity';

@Injectable()
export class SearchLogService {
  private readonly logger = new Logger(SearchLogService.name);

  constructor(
    @InjectRepository(SearchLog)
    private readonly logRepo: Repository<SearchLog>,
  ) {}

  async findAll(page: number = 1, pageSize: number = 20): Promise<{ data: SearchLog[]; total: number }> {
    const [data, total] = await this.logRepo.findAndCount({ 
      where: { deletedAt: IsNull() },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' }
    });
    return { data, total };
  }

  async findById(id: string): Promise<SearchLog> {
    const log = await this.logRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!log) throw new NotFoundException(`Search log with ID ${id} not found`);
    return log;
  }

  async create(data: Partial<SearchLog>): Promise<SearchLog> {
    return this.logRepo.save(this.logRepo.create(data));
  }

  async findByUserId(userId: string, limit: number = 50): Promise<SearchLog[]> {
    return this.logRepo.find({
      where: { userId, deletedAt: IsNull() },
      take: limit,
      order: { createdAt: 'DESC' }
    });
  }

  async getAnalytics(startDate: Date, endDate: Date): Promise<{ totalSearches: number; averageResults: number; averageDurationMs: number }> {
    const result = await this.logRepo.createQueryBuilder('log')
      .select('COUNT(*)', 'total')
      .addSelect('AVG(log.resultsCount)', 'avgResults')
      .addSelect('AVG(log.durationMs)', 'avgDuration')
      .where('log.createdAt >= :start AND log.createdAt <= :end', { start: startDate, end: endDate })
      .getRawOne();
    return {
      totalSearches: parseInt(result?.total || '0', 10),
      averageResults: parseFloat(result?.avgResults || '0'),
      averageDurationMs: parseFloat(result?.avgDuration || '0')
    };
  }
}
