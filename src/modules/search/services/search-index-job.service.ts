import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { SearchIndexJob } from '../entities/search-index-job.entity';
import { IndexStatus } from '../enums/index-status.enum';

@Injectable()
export class SearchIndexJobService {
  private readonly logger = new Logger(SearchIndexJobService.name);

  constructor(
    @InjectRepository(SearchIndexJob)
    private readonly indexJobRepo: Repository<SearchIndexJob>,
  ) {}

  async findAll(): Promise<SearchIndexJob[]> {
    return this.indexJobRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<SearchIndexJob> {
    const j = await this.indexJobRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!j) throw new NotFoundException(`Index job with ID ${id} not found`);
    return j;
  }

  async create(data: Partial<SearchIndexJob>): Promise<SearchIndexJob> {
    if (!data.jobCode || !data.entityType || !data.entityId) {
      throw new BadRequestException('jobCode, entityType, and entityId are required');
    }
    return this.indexJobRepo.save(this.indexJobRepo.create(data));
  }

  async markIndexing(id: string): Promise<SearchIndexJob> {
    const j = await this.findById(id);
    j.status = IndexStatus.INDEXING;
    return this.indexJobRepo.save(j);
  }

  async markIndexed(id: string, indexedData?: Record<string, any>): Promise<SearchIndexJob> {
    const j = await this.findById(id);
    j.status = IndexStatus.INDEXED;
    j.indexedAt = new Date();
    if (indexedData) j.indexedData = indexedData;
    return this.indexJobRepo.save(j);
  }

  async markFailed(id: string, errorMessage: string): Promise<SearchIndexJob> {
    const j = await this.findById(id);
    j.status = IndexStatus.FAILED;
    j.errorMessage = errorMessage;
    return this.indexJobRepo.save(j);
  }

  async retry(id: string): Promise<SearchIndexJob> {
    const j = await this.findById(id);
    j.status = IndexStatus.PENDING;
    j.retryCount += 1;
    j.errorMessage = undefined;
    return this.indexJobRepo.save(j);
  }
}
