import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionRecord, ExceptionStatus } from '../entities/exception-record.entity';

@Injectable()
export class ExceptionRecordService {
  constructor(
    @InjectRepository(ExceptionRecord)
    private readonly repo: Repository<ExceptionRecord>,
  ) {}

  async create(data: Partial<ExceptionRecord>): Promise<ExceptionRecord> {
    return this.repo.save(this.repo.create(data));
  }

  async findAll(): Promise<ExceptionRecord[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ExceptionRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`ExceptionRecord ${id} not found`);
    return record;
  }

  async update(id: string, updates: Partial<ExceptionRecord>): Promise<ExceptionRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updates);
    return this.repo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.repo.remove(record);
  }

  async approve(id: string, approverId: string, notes?: string): Promise<ExceptionRecord> {
    const record = await this.findOne(id);
    if (record.status !== ExceptionStatus.REQUESTED) {
      throw new ForbiddenException(`Cannot approve exception with status ${record.status}`);
    }
    record.status = ExceptionStatus.APPROVED;
    record.approvedBy = approverId;
    if (notes) record.review_notes = notes;
    return this.repo.save(record);
  }

  async deny(id: string, denierId: string, reason: string): Promise<ExceptionRecord> {
    const record = await this.findOne(id);
    if (record.status !== ExceptionStatus.REQUESTED) {
      throw new ForbiddenException(`Cannot deny exception with status ${record.status}`);
    }
    record.status = ExceptionStatus.DENIED;
    record.approvedBy = denierId;
    record.review_notes = reason;
    return this.repo.save(record);
  }

  async revoke(id: string, revokedBy: string, reason: string): Promise<ExceptionRecord> {
    const record = await this.findOne(id);
    record.status = ExceptionStatus.REVOKED;
    record.approvedBy = revokedBy;
    record.review_notes = reason;
    return this.repo.save(record);
  }
}
