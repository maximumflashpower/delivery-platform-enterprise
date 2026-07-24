import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvidencePreservation, PreservationStatus } from '../entities/evidence-preservation.entity';
import { CreateEvidenceDto, SealEvidenceDto, VerifyChainDto, ReleaseEvidenceDto } from '../dto/evidence-preservation.dto';

@Injectable()
export class EvidencePreservationService {
  private readonly logger = new Logger(EvidencePreservationService.name);

  constructor(
    @InjectRepository(EvidencePreservation)
    private readonly repo: Repository<EvidencePreservation>,
  ) {}

  async create(dto: CreateEvidenceDto): Promise<EvidencePreservation> {
    const evidence = this.repo.create({
      ...dto,
      status: PreservationStatus.PENDING,
    });
    const saved = await this.repo.save(evidence);
    this.logger.log(`Evidence preservation created: ${saved.id} (${saved.caseName})`);
    return saved;
  }

  async findAll(filters?: { status?: string; severity?: string; evidenceType?: string }): Promise<EvidencePreservation[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.evidenceType) where.evidenceType = filters.evidenceType;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<EvidencePreservation> {
    const evidence = await this.repo.findOne({ where: { id } });
    if (!evidence) throw new NotFoundException(`Evidence ${id} not found`);
    return evidence;
  }

  async startCollection(id: string): Promise<EvidencePreservation> {
    const evidence = await this.findOne(id);
    evidence.status = PreservationStatus.COLLECTING;
    return this.repo.save(evidence);
  }

  async seal(id: string, dto: SealEvidenceDto): Promise<EvidencePreservation> {
    const evidence = await this.findOne(id);
    evidence.status = PreservationStatus.SEALED;
    evidence.hashChecksum = dto.hashChecksum;
    if (dto.storageLocation) evidence.storageLocation = dto.storageLocation;
    evidence.sealedAt = new Date();
    this.logger.warn(`Evidence sealed: ${id} (hash: ${dto.hashChecksum})`);
    return this.repo.save(evidence);
  }

  async verifyChain(id: string, dto: VerifyChainDto): Promise<EvidencePreservation> {
    const evidence = await this.findOne(id);
    evidence.status = PreservationStatus.CHAIN_OF_CUSTODY_VERIFIED;
    evidence.verifiedBy = dto.verifiedBy;
    if (dto.notes) evidence.chainOfCustodyNotes = dto.notes;
    return this.repo.save(evidence);
  }

  async release(id: string, dto: ReleaseEvidenceDto): Promise<EvidencePreservation> {
    const evidence = await this.findOne(id);
    evidence.status = PreservationStatus.RELEASED;
    evidence.releasedAt = new Date();
    if (dto.reason) evidence.chainOfCustodyNotes = `${evidence.chainOfCustodyNotes || ''}\nReleased: ${dto.reason}`;
    return this.repo.save(evidence);
  }

  async schedulePurge(id: string, purgeDate: string): Promise<EvidencePreservation> {
    const evidence = await this.findOne(id);
    evidence.purgeScheduledAt = new Date(purgeDate);
    return this.repo.save(evidence);
  }

  async recordAccess(id: string): Promise<EvidencePreservation> {
    const evidence = await this.findOne(id);
    evidence.accessCount += 1;
    return this.repo.save(evidence);
  }

  async getStats(): Promise<{
    totalEvidence: number;
    pending: number;
    collecting: number;
    sealed: number;
    chainVerified: number;
    released: number;
    legalHolds: number;
    purgedScheduled: number;
  }> {
    const all = await this.repo.find();
    return {
      totalEvidence: all.length,
      pending: all.filter(e => e.status === PreservationStatus.PENDING).length,
      collecting: all.filter(e => e.status === PreservationStatus.COLLECTING).length,
      sealed: all.filter(e => e.status === PreservationStatus.SEALED).length,
      chainVerified: all.filter(e => e.status === PreservationStatus.CHAIN_OF_CUSTODY_VERIFIED).length,
      released: all.filter(e => e.status === PreservationStatus.RELEASED).length,
      legalHolds: all.filter(e => e.severity === 'legal_hold').length,
      purgedScheduled: all.filter(e => e.purgeScheduledAt !== null).length,
    };
  }
}
