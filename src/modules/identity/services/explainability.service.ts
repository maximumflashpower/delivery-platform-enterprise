import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExplainabilityRecord } from '../entities/explainability-record.entity';
import { CreateExplainabilityDto } from '../dto/create-explainability.dto';

@Injectable()
export class ExplainabilityService {
  constructor(
    @InjectRepository(ExplainabilityRecord)
    private readonly repo: Repository<ExplainabilityRecord>,
  ) {}

  async create(dto: CreateExplainabilityDto): Promise<ExplainabilityRecord> {
    const record = new ExplainabilityRecord();
    record.userId = dto.userId;
    record.decisionType = dto.decisionType;
    record.decisionRefId = dto.decisionRefId || '';
    record.explanation = dto.explanation;
    record.factors = dto.factors || '';
    record.inputData = dto.inputData || '';
    record.outputData = dto.outputData || '';
    record.confidenceScore = dto.confidenceScore || 0;
    record.modelVersion = dto.modelVersion || '';
    record.status = (dto.status as any) || 'generated';
    return this.repo.save(record);
  }

  async findByUser(userId: string, limit?: number): Promise<ExplainabilityRecord[]> {
    const query = this.repo.createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .orderBy('record.createdAt', 'DESC');

    if (limit) query.take(limit);
    return query.getMany();
  }

  async findById(id: string): Promise<ExplainabilityRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Explainability record ${id} not found`);
    return record;
  }

  async review(id: string, reviewedBy: string, notes?: string): Promise<ExplainabilityRecord> {
    const record = await this.findById(id);
    record.status = 'reviewed';
    record.reviewedBy = reviewedBy;
    record.reviewedAt = new Date();
    if (notes) record.userFeedback = notes;
    return this.repo.save(record);
  }

  async dispute(id: string, feedback: string): Promise<ExplainabilityRecord> {
    const record = await this.findById(id);
    record.status = 'disputed';
    record.userFeedback = feedback;
    return this.repo.save(record);
  }

  async rate(id: string, rating: number): Promise<ExplainabilityRecord> {
    const record = await this.findById(id);
    record.rating = Math.max(0, Math.min(5, rating));
    return this.repo.save(record);
  }

  async archive(id: string): Promise<ExplainabilityRecord> {
    const record = await this.findById(id);
    record.status = 'archived';
    return this.repo.save(record);
  }

  async getByDecisionType(decisionType: string): Promise<ExplainabilityRecord[]> {
    return this.repo.find({
      where: { decisionType },
      order: { createdAt: 'DESC' },
    });
  }
}
