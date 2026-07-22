import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, LessThan, Not, In } from 'typeorm';
import { DsarRequest } from '../entities/dsar-request.entity';
import { DeletionScope } from '../entities/deletion-scope.entity';
import { DataExportJob } from '../entities/data-export-job.entity';
import {
  DsarRequestStatus,
  DsarRequestType,
  DeletionScopeStatus,
  ExportJobStatus,
  DataCategory,
} from '../enums/dsar.enums';
import {
  CreateDsarRequestDto,
  UpdateDsarStatusDto,
  CreateDeletionScopeDto,
  UpdateDeletionScopeDto,
  ExecuteDeletionDto,
  CreateExportJobDto,
  DsarQueryDto,
} from '../dto/dsar-portal.dto';

@Injectable()
export class DsarPortalService {
  private readonly logger = new Logger(DsarPortalService.name);

  constructor(
    @InjectRepository(DsarRequest)
    private readonly dsarRequestRepo: Repository<DsarRequest>,
    @InjectRepository(DeletionScope)
    private readonly deletionScopeRepo: Repository<DeletionScope>,
    @InjectRepository(DataExportJob)
    private readonly exportJobRepo: Repository<DataExportJob>,
  ) {}

  // ════════════════════════════════════════════
  // DSAR REQUEST METHODS
  // ════════════════════════════════════════════

  async createRequest(dto: CreateDsarRequestDto): Promise<DsarRequest> {
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días por defecto (GDPR)

    const request = this.dsarRequestRepo.create({
      userId: dto.userId,
      userEmail: dto.userEmail,
      requestType: dto.requestType,
      priority: dto.priority ?? 'normal',
      description: dto.description,
      dueDate,
      metadata: dto.metadata,
      status: DsarRequestStatus.SUBMITTED,
    });

    const saved = await this.dsarRequestRepo.save(request);
    this.logger.log(`DSAR request created: ${saved.id} for user ${dto.userId}`);
    return saved;
  }

  async findAllRequests(query?: DsarQueryDto): Promise<{ items: DsarRequest[]; total: number }> {
    const limit = Math.min(query?.limit ?? 50, 200);
    const offset = query?.offset ?? 0;

    const findOptions: FindManyOptions<DsarRequest> = {
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
      relations: ['deletionScopes', 'exportJobs'],
    };

    if (query?.status || query?.requestType) {
      findOptions.where = {};
      if (query.status) findOptions.where['status'] = query.status as any;
      if (query.requestType) findOptions.where['requestType'] = query.requestType as any;
    }

    const [items, total] = await this.dsarRequestRepo.findAndCount(findOptions);
    return { items, total };
  }

  async findRequestById(id: string): Promise<DsarRequest> {
    const request = await this.dsarRequestRepo.findOne({
      where: { id },
      relations: ['deletionScopes', 'exportJobs'],
    });
    if (!request) throw new NotFoundException(`DSAR request ${id} not found`);
    return request;
  }

  async findRequestsByUser(userId: string): Promise<DsarRequest[]> {
    return this.dsarRequestRepo.find({
      where: { userId },
      relations: ['deletionScopes', 'exportJobs'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateRequestStatus(id: string, dto: UpdateDsarStatusDto): Promise<DsarRequest> {
    const request = await this.findRequestById(id);

    const validTransitions: Record<string, string[]> = {
      submitted: ['identity_verified', 'rejected', 'cancelled'],
      identity_verified: ['in_review', 'processing', 'rejected'],
      in_review: ['processing', 'rejected', 'cancelled'],
      processing: ['completed', 'rejected'],
      completed: [],
      rejected: [],
      cancelled: [],
    };

    const allowed = validTransitions[request.status];
    if (allowed && !allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Invalid status transition: ${request.status} → ${dto.status}`,
      );
    }

    request.status = dto.status;

    if (dto.identityVerified !== undefined) {
      request.identityVerified = dto.identityVerified;
      if (dto.identityVerified) {
        request.verifiedAt = new Date();
        request.verifiedBy = dto.verifiedBy;
      }
    }

    if (dto.rejectionReason) {
      request.rejectionReason = dto.rejectionReason;
    }

    if (dto.status === DsarRequestStatus.COMPLETED) {
      request.completedAt = new Date();
    }

    return this.dsarRequestRepo.save(request);
  }

  // ════════════════════════════════════════════
  // DELETION SCOPE METHODS
  // ════════════════════════════════════════════

  async createDeletionScope(dto: CreateDeletionScopeDto): Promise<DeletionScope> {
    const request = await this.findRequestById(dto.requestId);

    if (request.requestType !== DsarRequestType.DELETION) {
      throw new BadRequestException(
        'Deletion scopes can only be created for deletion-type requests',
      );
    }

    if (!request.identityVerified) {
      throw new BadRequestException(
        'Identity must be verified before creating deletion scopes',
      );
    }

    const scope = this.deletionScopeRepo.create({
      requestId: dto.requestId,
      userId: dto.userId,
      categories: dto.categories,
      justification: dto.justification,
      status: DeletionScopeStatus.PENDING,
    });

    const saved = await this.deletionScopeRepo.save(scope);
    this.logger.log(`Deletion scope created: ${saved.id} for request ${dto.requestId}`);
    return saved;
  }

  async findDeletionScopesByRequest(requestId: string): Promise<DeletionScope[]> {
    return this.deletionScopeRepo.find({
      where: { requestId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateDeletionScope(id: string, dto: UpdateDeletionScopeDto): Promise<DeletionScope> {
    const scope = await this.deletionScopeRepo.findOne({ where: { id } });
    if (!scope) throw new NotFoundException(`Deletion scope ${id} not found`);

    if (scope.status !== DeletionScopeStatus.PENDING) {
      throw new BadRequestException(
        `Cannot modify scope in status: ${scope.status}`,
      );
    }

    if (dto.categories) scope.categories = dto.categories;
    if (dto.justification !== undefined) scope.justification = dto.justification;

    return this.deletionScopeRepo.save(scope);
  }

  async deleteDeletionScope(id: string): Promise<void> {
    const scope = await this.deletionScopeRepo.findOne({ where: { id } });
    if (!scope) throw new NotFoundException(`Deletion scope ${id} not found`);

    if (scope.status === DeletionScopeStatus.EXECUTING ||
        scope.status === DeletionScopeStatus.COMPLETED) {
      throw new BadRequestException(
        `Cannot delete scope in status: ${scope.status}`,
      );
    }

    await this.deletionScopeRepo.remove(scope);
  }

  async executeDeletion(id: string, dto: ExecuteDeletionDto): Promise<DeletionScope> {
    const scope = await this.deletionScopeRepo.findOne({ where: { id } });
    if (!scope) throw new NotFoundException(`Deletion scope ${id} not found`);

    if (scope.status !== DeletionScopeStatus.PENDING &&
        scope.status !== DeletionScopeStatus.APPROVED) {
      throw new BadRequestException(
        `Cannot execute scope in status: ${scope.status}`,
      );
    }

    scope.status = DeletionScopeStatus.EXECUTING;
    scope.approvedBy = dto.approvedBy;
    scope.approvedAt = new Date();
    await this.deletionScopeRepo.save(scope);

    try {
      let totalAffected = 0;

      for (const category of scope.categories) {
        const affected = await this.executeCategoryDeletion(scope.userId, category);
        totalAffected += affected;
      }

      scope.status = DeletionScopeStatus.COMPLETED;
      scope.executedAt = new Date();
      scope.recordsAffected = totalAffected;

      this.logger.log(
        `Deletion executed: scope ${id}, ${totalAffected} records affected`,
      );

      return this.deletionScopeRepo.save(scope);
    } catch (error) {
      scope.status = DeletionScopeStatus.FAILED;
      scope.failureReason = error.message;
      await this.deletionScopeRepo.save(scope);
      throw error;
    }
  }

  private async executeCategoryDeletion(
    userId: string,
    category: DataCategory,
  ): Promise<number> {
    // Simulated deletion — in production, this would query and delete
    // records from the corresponding module's tables
    this.logger.log(`Executing deletion for category: ${category}, user: ${userId}`);
    const simulatedCount = Math.floor(Math.random() * 50) + 1;
    return simulatedCount;
  }

  // ════════════════════════════════════════════
  // EXPORT JOB METHODS
  // ════════════════════════════════════════════

  async createExportJob(dto: CreateExportJobDto): Promise<DataExportJob> {
    const request = await this.findRequestById(dto.requestId);

    if (request.requestType !== DsarRequestType.EXPORT &&
        request.requestType !== DsarRequestType.PORTABILITY) {
      throw new BadRequestException(
        'Export jobs can only be created for export/portability requests',
      );
    }

    if (!request.identityVerified) {
      throw new BadRequestException(
        'Identity must be verified before creating export jobs',
      );
    }

    const expiryDays = dto.expiryDays ?? 7;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    const job = this.exportJobRepo.create({
      requestId: dto.requestId,
      userId: dto.userId,
      format: dto.format ?? 'json',
      includedCategories: dto.includedCategories ?? Object.values(DataCategory),
      status: ExportJobStatus.QUEUED,
      expiresAt,
    });

    const saved = await this.exportJobRepo.save(job);
    this.logger.log(`Export job created: ${saved.id} for request ${dto.requestId}`);
    return saved;
  }

  async findExportJobById(id: string): Promise<DataExportJob> {
    const job = await this.exportJobRepo.findOne({
      where: { id },
      relations: ['request'],
    });
    if (!job) throw new NotFoundException(`Export job ${id} not found`);
    return job;
  }

  async findExportJobsByRequest(requestId: string): Promise<DataExportJob[]> {
    return this.exportJobRepo.find({
      where: { requestId },
      order: { createdAt: 'DESC' },
    });
  }

  async generateExport(id: string): Promise<DataExportJob> {
    const job = await this.findExportJobById(id);

    if (job.status !== ExportJobStatus.QUEUED) {
      throw new BadRequestException(`Export job ${id} is not in queued state`);
    }

    job.status = ExportJobStatus.GENERATING;
    job.processedRecords = 0;
    await this.exportJobRepo.save(job);

    try {
      const categories = job.includedCategories.length > 0
        ? job.includedCategories
        : Object.values(DataCategory);

      let totalRecords = 0;
      for (const category of categories) {
        // Simulated count — would query actual data in production
        totalRecords += Math.floor(Math.random() * 100) + 10;
      }

      job.totalRecords = totalRecords;
      job.processedRecords = totalRecords;
      job.status = ExportJobStatus.READY;
      job.fileUrl = `/exports/dsar/${job.id}.json`;
      job.fileSizeBytes = Math.floor(totalRecords * 512);
      job.generatedAt = new Date();

      this.logger.log(`Export generated: ${job.id}, ${totalRecords} records`);
      return this.exportJobRepo.save(job);
    } catch (error) {
      job.status = ExportJobStatus.FAILED;
      job.errorMessage = error.message;
      await this.exportJobRepo.save(job);
      throw error;
    }
  }

  async downloadExport(id: string): Promise<{ url: string; format: string }> {
    const job = await this.findExportJobById(id);

    if (job.status !== ExportJobStatus.READY) {
      throw new BadRequestException(
        `Export ${id} is not ready (status: ${job.status})`,
      );
    }

    if (job.expiresAt && job.expiresAt < new Date()) {
      job.status = ExportJobStatus.EXPIRED;
      await this.exportJobRepo.save(job);
      throw new BadRequestException(`Export ${id} has expired`);
    }

    return { url: job.fileUrl, format: job.format };
  }

  // ════════════════════════════════════════════
  // STATS
  // ════════════════════════════════════════════

  async getStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    rejectedRequests: number;
    activeDeletions: number;
    pendingExports: number;
  }> {
    const [totalRequests, pendingRequests, completedRequests, rejectedRequests] =
      await Promise.all([
        this.dsarRequestRepo.count(),
        this.dsarRequestRepo.count({ where: { status: DsarRequestStatus.SUBMITTED } }),
        this.dsarRequestRepo.count({ where: { status: DsarRequestStatus.COMPLETED } }),
        this.dsarRequestRepo.count({ where: { status: DsarRequestStatus.REJECTED } }),
      ]);

    const activeDeletions = await this.deletionScopeRepo.count({
      where: { status: DeletionScopeStatus.EXECUTING },
    });

    const pendingExports = await this.exportJobRepo.count({
      where: [
        { status: ExportJobStatus.QUEUED },
        { status: ExportJobStatus.GENERATING },
      ],
    });

    return {
      totalRequests,
      pendingRequests,
      completedRequests,
      rejectedRequests,
      activeDeletions,
      pendingExports,
    };
  }
}
