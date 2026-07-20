import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataProcessingRecord } from '../entities/data-processing-record.entity';

@Injectable()
export class DataProcessingService {
  constructor(
    @InjectRepository(DataProcessingRecord)
    private readonly repo: Repository<DataProcessingRecord>,
  ) {}

  async create(data: Partial<DataProcessingRecord>): Promise<DataProcessingRecord> {
    return this.repo.save(this.repo.create(data));
  }

  async findByUser(userId: string): Promise<DataProcessingRecord[]> {
    return this.repo.find({
      where: { userId },
      order: { processingStartedAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<DataProcessingRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`DataProcessingRecord ${id} not found`);
    return record;
  }

  async endProcessing(id: string): Promise<DataProcessingRecord> {
    const record = await this.findOne(id);
    record.processing_ended_at = new Date();
    return this.repo.save(record);
  }

  async updateRetention(id: string, policy: string): Promise<DataProcessingRecord> {
    const record = await this.findOne(id);
    record.retention_policy = policy;
    return this.repo.save(record);
  }
}
