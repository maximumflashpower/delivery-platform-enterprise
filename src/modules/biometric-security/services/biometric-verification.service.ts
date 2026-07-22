import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiometricUsageLog } from '../entities/biometric-usage-log.entity';
import { BiometricDataCatalog } from '../entities/biometric-data-catalog.entity';
import { LogBiometricUsageDto } from '../dto/biometric-verification.dto';

@Injectable()
export class BiometricVerificationService {
  private readonly logger = new Logger(BiometricVerificationService.name);

  constructor(
    @InjectRepository(BiometricUsageLog)
    private readonly usageLogRepo: Repository<BiometricUsageLog>,
    @InjectRepository(BiometricDataCatalog)
    private readonly catalogRepo: Repository<BiometricDataCatalog>,
  ) {}

  async logUsage(dto: LogBiometricUsageDto): Promise<BiometricUsageLog> {
    const log = new BiometricUsageLog();
    Object.assign(log, dto);
    log.approvalStatus = 'approved';
    log.usageTimestamp = new Date();
    
    return this.usageLogRepo.save(log);
  }

  async approveUsage(logId: string, approvedByUserId: string): Promise<BiometricUsageLog> {
    const log = await this.usageLogRepo.findOne({ where: { id: logId } });
    if (!log) throw new NotFoundException(`Usage log ${logId} not found`);
    
    log.approvalStatus = 'approved';
    log.approvedByUserId = approvedByUserId;
    
    return this.usageLogRepo.save(log);
  }

  async denyUsage(logId: string, reason: string): Promise<BiometricUsageLog> {
    const log = await this.usageLogRepo.findOne({ where: { id: logId } });
    if (!log) throw new NotFoundException(`Usage log ${logId} not found`);
    
    log.approvalStatus = 'denied';
    log.rejectionReason = reason;
    
    return this.usageLogRepo.save(log);
  }

  async getUsageStats(modelId?: string): Promise<{
    totalLogs: number;
    byType: Record<string, number>;
    byOperation: Record<string, number>;
    approved: number;
    denied: number;
    pendingReview: number;
  }> {
    let logs: BiometricUsageLog[];
    if (modelId) {
      logs = await this.usageLogRepo.find({ where: { modelId } });
    } else {
      logs = await this.usageLogRepo.find();
    }
    
    const totalLogs = logs.length;
    const byType: Record<string, number> = {};
    const byOperation: Record<string, number> = {};
    let approved = 0;
    let denied = 0;
    let pendingReview = 0;
    
    logs.forEach(l => {
      byType[l.biometricType] = (byType[l.biometricType] || 0) + 1;
      byOperation[l.operationType] = (byOperation[l.operationType] || 0) + 1;
      
      if (l.approvalStatus === 'approved') approved++;
      else if (l.approvalStatus === 'denied') denied++;
      else pendingReview++;
    });
    
    return { totalLogs, byType, byOperation, approved, denied, pendingReview };
  }

  async catalogData(dto: any): Promise<BiometricDataCatalog> {
    const entry = new BiometricDataCatalog();
    entry.userId = dto.userId;
    entry.biometricType = dto.biometricType;
    entry.dataSource = dto.dataSource;
    entry.storageLocation = dto.storageLocation;
    entry.dataTreatment = 'anonymized';
    entry.accessCount = 0;
    entry.isDeleted = false;
    
    return this.catalogRepo.save(entry);
  }

  async trackAccess(catalogId: string): Promise<BiometricDataCatalog> {
    const entry = await this.catalogRepo.findOne({ where: { id: catalogId } });
    if (!entry) throw new NotFoundException(`Catalog entry ${catalogId} not found`);
    
    entry.lastAccessedAt = new Date();
    entry.accessCount += 1;
    
    return this.catalogRepo.save(entry);
  }

  async getAllLogs(): Promise<BiometricUsageLog[]> {
    return this.usageLogRepo.find({ order: { createdAt: 'DESC' } });
  }
}
