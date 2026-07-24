import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SponsorComplianceRecord, ComplianceCheckType, ComplianceAction } from '../entities/sponsor-compliance-record.entity';
import { CreateComplianceRecordDto, UpdateComplianceRecordDto } from '../dto/sponsor-compliance.dto';

@Injectable()
export class SponsorComplianceService {
  private readonly logger = new Logger(SponsorComplianceService.name);

  constructor(
    @InjectRepository(SponsorComplianceRecord)
    private readonly repo: Repository<SponsorComplianceRecord>,
  ) {}

  async create(dto: CreateComplianceRecordDto): Promise<SponsorComplianceRecord> {
    const record = this.repo.create(dto);
    const saved = await this.repo.save(record);
    this.logger.log(`Compliance record created: ${saved.id} for ${dto.sponsorName} (${dto.checkType})`);
    return saved;
  }

  async findAll(filters?: { sponsorId?: string; checkType?: string; reviewStatus?: string }): Promise<SponsorComplianceRecord[]> {
    const where: any = {};
    if (filters?.sponsorId) where.sponsorId = filters.sponsorId;
    if (filters?.checkType) where.checkType = filters.checkType;
    if (filters?.reviewStatus) where.reviewStatus = filters.reviewStatus;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findBySponsor(sponsorId: string): Promise<SponsorComplianceRecord[]> {
    return this.repo.find({ where: { sponsorId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SponsorComplianceRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Compliance record ${id} not found`);
    return record;
  }

  async update(id: string, dto: UpdateComplianceRecordDto): Promise<SponsorComplianceRecord> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async passVerification(id: string): Promise<SponsorComplianceRecord> {
    const record = await this.findOne(id);
    record.isPassed = true;
    record.action = ComplianceAction.VERIFICATION_PASSED;
    record.reviewStatus = 'approved';
    this.logger.log(`Compliance verification passed: ${record.id}`);
    return this.repo.save(record);
  }

  async failVerification(id: string, notes: string): Promise<SponsorComplianceRecord> {
    const record = await this.findOne(id);
    record.isPassed = false;
    record.action = ComplianceAction.VERIFICATION_FAILED;
    record.reviewerNotes = notes;
    record.reviewStatus = 'failed';
    this.logger.warn(`Compliance verification failed: ${record.id} - ${notes}`);
    return this.repo.save(record);
  }

  async requireRemediation(id: string, notes: string): Promise<SponsorComplianceRecord> {
    const record = await this.findOne(id);
    record.action = ComplianceAction.REMEDIATION_REQUIRED;
    record.reviewerNotes = notes;
    record.reviewStatus = 'remediation_needed';
    this.logger.warn(`Remediation required: ${record.id} - ${notes}`);
    return this.repo.save(record);
  }

  async grantExemption(id: string, notes: string): Promise<SponsorComplianceRecord> {
    const record = await this.findOne(id);
    record.action = ComplianceAction.EXEMPTION_GRANTED;
    record.reviewerNotes = notes;
    record.reviewStatus = 'exempt';
    return this.repo.save(record);
  }

  async getSponsorComplianceSummary(sponsorId: string): Promise<{
    totalRecords: number;
    passed: number;
    failed: number;
    pending: number;
    complianceRate: number;
    byCheckType: Record<string, { passed: number; failed: number; pending: number }>;
  }> {
    const records = await this.findBySponsor(sponsorId);
    const summary = {
      totalRecords: records.length,
      passed: records.filter(r => r.isPassed).length,
      failed: records.filter(r => !r.isPassed && r.reviewStatus === 'failed').length,
      pending: records.filter(r => r.reviewStatus !== 'approved' && r.reviewStatus !== 'failed').length,
      complianceRate: 0,
      byCheckType: {} as Record<string, { passed: number; failed: number; pending: number }>,
    };
    
    summary.complianceRate = summary.totalRecords > 0 ? (summary.passed / summary.totalRecords) * 100 : 0;
    
    records.forEach(r => {
      if (!summary.byCheckType[r.checkType]) {
        summary.byCheckType[r.checkType] = { passed: 0, failed: 0, pending: 0 };
      }
      if (r.isPassed) summary.byCheckType[r.checkType].passed++;
      else if (r.reviewStatus === 'failed') summary.byCheckType[r.checkType].failed++;
      else summary.byCheckType[r.checkType].pending++;
    });
    
    return summary;
  }

  async getStats(): Promise<{
    totalRecords: number;
    passed: number;
    failed: number;
    pending: number;
    complianceRate: number;
    byCheckType: Record<string, number>;
  }> {
    const all = await this.repo.find();
    const types: Record<string, number> = {};
    
    all.forEach(r => {
      types[r.checkType] = (types[r.checkType] || 0) + 1;
    });
    
    return {
      totalRecords: all.length,
      passed: all.filter(r => r.isPassed).length,
      failed: all.filter(r => !r.isPassed && r.reviewStatus === 'failed').length,
      pending: all.filter(r => r.reviewStatus !== 'approved' && r.reviewStatus !== 'failed').length,
      complianceRate: all.length > 0 ? (all.filter(r => r.isPassed).length / all.length) * 100 : 0,
      byCheckType: types,
    };
  }
}
