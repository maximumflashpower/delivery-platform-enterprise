import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DamageRecord, DamageStatus } from '../entities/damage-record.entity';

@Injectable()
export class DamageRecordService {
  constructor(
    @InjectRepository(DamageRecord)
    private readonly repo: Repository<DamageRecord>,
  ) {}

  async create(data: Partial<DamageRecord>): Promise<DamageRecord> {
    return this.repo.save(this.repo.create(data));
  }

  async findAll(): Promise<DamageRecord[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<DamageRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`DamageRecord ${id} not found`);
    return record;
  }

  async update(id: string, updates: Partial<DamageRecord>): Promise<DamageRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updates);
    return this.repo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.repo.remove(record);
  }

  async investigate(id: string, investigatorId: string): Promise<DamageRecord> {
    const record = await this.findOne(id);
    record.status = DamageStatus.INVESTIGATING;
    record.reportedBy = investigatorId;
    return this.repo.save(record);
  }

  async confirm(id: string): Promise<DamageRecord> {
    const record = await this.findOne(id);
    record.status = DamageStatus.CONFIRMED;
    return this.repo.save(record);
  }

  async resolve(id: string, resolutionNotes: string): Promise<DamageRecord> {
    const record = await this.findOne(id);
    record.status = DamageStatus.RESOLVED;
    record.resolution_notes = resolutionNotes;
    record.resolved_at = new Date();
    return this.repo.save(record);
  }

  async dismiss(id: string, reason: string): Promise<DamageRecord> {
    const record = await this.findOne(id);
    record.status = DamageStatus.DISMISSED;
    record.resolution_notes = reason;
    return this.repo.save(record);
  }
}
