import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SponsorSplit, SplitType, SplitStatus } from '../entities/sponsor-split.entity';
import { SplitParticipant, ParticipantRole } from '../entities/split-participant.entity';
import { SponsorRiskAssessment, RiskLevel, AssessmentStatus } from '../entities/sponsor-risk-assessment.entity';
import { CreateSplitDto } from '../dto/create-split.dto';
import { CreateRiskAssessmentDto } from '../dto/create-risk-assessment.dto';

@Injectable()
export class SplitService {
  constructor(
    @InjectRepository(SponsorSplit)
    private readonly splitRepo: Repository<SponsorSplit>,
    @InjectRepository(SplitParticipant)
    private readonly participantRepo: Repository<SplitParticipant>,
    @InjectRepository(SponsorRiskAssessment)
    private readonly riskRepo: Repository<SponsorRiskAssessment>,
    private readonly dataSource: DataSource,
  ) {}

  // ============ SPLITS ============

  async createSplit(dto: CreateSplitDto): Promise<SponsorSplit> {
    const totalShares = dto.participants.reduce((sum, p) => sum + p.sharePercentage, 0);
    if (Math.abs(totalShares - 100) > 0.01) {
      throw new BadRequestException(`Total shares must equal 100%, got ${totalShares.toFixed(2)}%`);
    }

    const splitTypeStr = String(dto.splitType);
    if ((splitTypeStr === 'sponsor_risk' || splitTypeStr === 'hybrid') && dto.riskAssessmentId) {
      const assessment = await this.riskRepo.findOne({ where: { id: dto.riskAssessmentId } });
      if (!assessment) {
        throw new NotFoundException(`Risk assessment ${dto.riskAssessmentId} not found`);
      }
      if (assessment.assessmentStatus !== AssessmentStatus.APPROVED) {
        throw new BadRequestException(`Risk assessment must be approved before use`);
      }
    }

    const participants = dto.participants.map(p => {
      const adjustedPercentage = this.applyRiskAdjustment(p.sharePercentage, p.riskAdjustment || 0);
      const shareAmount = (dto.totalAmount * adjustedPercentage) / 100;

      const participant = new SplitParticipant();
      participant.userId = p.userId;
      participant.userName = p.userName;
      participant.role = p.role as ParticipantRole;
      participant.sharePercentage = adjustedPercentage;
      participant.shareAmount = Math.round(shareAmount * 100) / 100;
      participant.riskAdjustment = p.riskAdjustment || 0;
      participant.contributionScore = p.contributionScore || 50;
      participant.isLocked = false;
      return participant;
    });

    const split = new SponsorSplit();
    split.splitType = splitTypeStr as unknown as SplitType;
    split.status = SplitStatus.DRAFT;
    split.totalAmount = dto.totalAmount;
    split.currency = dto.currency;
    split.referenceId = dto.referenceId || null;
    split.referenceType = dto.referenceType || null;
    split.description = dto.description || null;
    split.createdBy = dto.createdBy;
    split.riskAssessmentId = dto.riskAssessmentId || null;
    split.participants = participants;

    return this.splitRepo.save(split);
  }

  async findAllSplits(status?: string): Promise<SponsorSplit[]> {
    const where: any = {};
    if (status) where.status = status;
    return this.splitRepo.find({
      where,
      relations: ['participants', 'riskAssessment'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findSplit(id: string): Promise<SponsorSplit> {
    const split = await this.splitRepo.findOne({
      where: { id },
      relations: ['participants', 'riskAssessment'],
    });
    if (!split) throw new NotFoundException(`Split ${id} not found`);
    return split;
  }

  async approveSplit(id: string, approvedBy: string): Promise<SponsorSplit> {
    const split = await this.findSplit(id);
    if (split.status !== SplitStatus.DRAFT && split.status !== SplitStatus.PENDING) {
      throw new BadRequestException(`Split must be in draft or pending status to approve`);
    }
    split.status = SplitStatus.APPROVED;
    split.approvedBy = approvedBy;
    split.approvedAt = new Date();
    return this.splitRepo.save(split);
  }

  async executeSplit(id: string): Promise<SponsorSplit> {
    const split = await this.findSplit(id);
    if (split.status !== SplitStatus.APPROVED) {
      throw new BadRequestException(`Split must be approved before execution`);
    }

    split.status = SplitStatus.EXECUTED;
    split.executedAt = new Date();
    split.executionTxHash = `sim_tx_${Date.now()}_${id.slice(0, 8)}`;

    split.participants.forEach(p => {
      p.isLocked = true;
    });

    return this.splitRepo.save(split);
  }

  async cancelSplit(id: string, reason: string): Promise<SponsorSplit> {
    const split = await this.findSplit(id);
    if (split.status === SplitStatus.EXECUTED) {
      throw new BadRequestException(`Cannot cancel executed split`);
    }
    split.status = SplitStatus.CANCELLED;
    split.description = `${split.description || ''}\n\nCancelled: ${reason}`.trim();
    return this.splitRepo.save(split);
  }

  async getSplitsByReference(referenceId: string): Promise<SponsorSplit[]> {
    return this.splitRepo.find({
      where: { referenceId },
      relations: ['participants'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  // ============ RISK ASSESSMENTS ============

  async createRiskAssessment(dto: CreateRiskAssessmentDto): Promise<SponsorRiskAssessment> {
    const assessment = new SponsorRiskAssessment();
    assessment.sponsorId = dto.sponsorId;
    assessment.sponsorName = dto.sponsorName;
    assessment.riskLevel = String(dto.riskLevel) as unknown as RiskLevel;
    assessment.riskScore = dto.riskScore;
    assessment.maxExposure = dto.maxExposure || null;
    assessment.assessedBy = dto.assessedBy || null;
    assessment.assessedAt = dto.assessedBy ? new Date() : null;
    assessment.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    assessment.notes = dto.notes || null;
    assessment.flags = dto.flags || null;
    assessment.assessmentStatus = dto.assessedBy ? AssessmentStatus.APPROVED : AssessmentStatus.PENDING;
    return this.riskRepo.save(assessment);
  }

  async findAllRiskAssessments(): Promise<SponsorRiskAssessment[]> {
    return this.riskRepo.find({ order: { createdAt: 'DESC' } as any });
  }

  async findRiskAssessment(id: string): Promise<SponsorRiskAssessment> {
    const assessment = await this.riskRepo.findOne({ where: { id } });
    if (!assessment) throw new NotFoundException(`Risk assessment ${id} not found`);
    return assessment;
  }

  async approveRiskAssessment(id: string, approvedBy: string): Promise<SponsorRiskAssessment> {
    const assessment = await this.findRiskAssessment(id);
    if (assessment.assessmentStatus !== AssessmentStatus.PENDING) {
      throw new BadRequestException(`Risk assessment must be pending to approve`);
    }
    assessment.assessmentStatus = AssessmentStatus.APPROVED;
    assessment.assessedBy = approvedBy;
    assessment.assessedAt = new Date();
    return this.riskRepo.save(assessment);
  }

  async rejectRiskAssessment(id: string, rejectedBy: string, reason: string): Promise<SponsorRiskAssessment> {
    const assessment = await this.findRiskAssessment(id);
    assessment.assessmentStatus = AssessmentStatus.REJECTED;
    assessment.assessedBy = rejectedBy;
    assessment.assessedAt = new Date();
    assessment.notes = `${assessment.notes || ''}\n\nRejected by ${rejectedBy}: ${reason}`.trim();
    return this.riskRepo.save(assessment);
  }

  async getRiskBySponsor(sponsorId: string): Promise<SponsorRiskAssessment[]> {
    return this.riskRepo.find({
      where: { sponsorId },
      order: { createdAt: 'DESC' } as any,
    });
  }

  // ============ HELPERS ============

  private applyRiskAdjustment(basePercentage: number, adjustment: number): number {
    const adjusted = basePercentage + (basePercentage * adjustment / 100);
    return Math.max(0, Math.min(100, Math.round(adjusted * 100) / 100));
  }

  async getSplitStats(): Promise<any> {
    const total = await this.splitRepo.count();
    const byStatus = await this.splitRepo
      .createQueryBuilder('s')
      .select('s.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(s.total_amount)', 'totalAmount')
      .groupBy('s.status')
      .getRawMany();

    const byType = await this.splitRepo
      .createQueryBuilder('s')
      .select('s.splitType', 'splitType')
      .addSelect('COUNT(*)', 'count')
      .addGroupBy('s.splitType')
      .getRawMany();

    return { total, byStatus, byType };
  }
}
