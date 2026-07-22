import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { IaDecisionAppeal } from '../entities/ia-decision-appeal.entity';
import { CreateIaDecisionAppealDto, HumanReviewDto, EscalateToBoardDto } from '../dto/ia-decision-appeal.dto';

@Injectable()
export class IaDecisionAppealService {
  private readonly logger = new Logger(IaDecisionAppealService.name);

  constructor(
    @InjectRepository(IaDecisionAppeal)
    private readonly repo: Repository<IaDecisionAppeal>,
  ) {}

  async create(dto: CreateIaDecisionAppealDto): Promise<IaDecisionAppeal> {
    const appeal = new IaDecisionAppeal();
    Object.assign(appeal, dto);
    appeal.reviewStatus = 'pending_review';
    return this.repo.save(appeal);
  }

  async findByAppeal(appealId: string): Promise<IaDecisionAppeal[]> {
    return this.repo.find({ where: { appealId } });
  }

  async findByDecision(decisionId: string): Promise<IaDecisionAppeal[]> {
    return this.repo.find({ where: { decisionId } });
  }

  async findById(id: string): Promise<IaDecisionAppeal> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`IA decision appeal ${id} not found`);
    return item;
  }

  async findAll(): Promise<IaDecisionAppeal[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async startHumanReview(id: string, dto: HumanReviewDto): Promise<IaDecisionAppeal> {
    const appeal = await this.findById(id);
    appeal.humanReviewerId = dto.reviewerId;
    appeal.reviewStatus = 'under_human_review';
    
    // Store notes and set up decision processing
    appeal.humanReviewNotes = dto.reviewNotes;
    await this.repo.save(appeal);

    this.logger.log(`Human review started for IA decision appeal ${id} by ${dto.reviewerId}`);
    return appeal;
  }

  async completeReview(id: string, dto: HumanReviewDto): Promise<IaDecisionAppeal> {
    const appeal = await this.findById(id);
    
    switch (dto.reviewDecision) {
      case 'uphold':
        appeal.reviewStatus = 'upheld';
        break;
      case 'overturn':
        appeal.reviewStatus = 'overturned';
        break;
      case 'request_more_info':
        appeal.reviewStatus = 'under_human_review'; // Keep in review
        break;
    }
    
    appeal.humanReviewerId = dto.reviewerId;
    appeal.humanReviewNotes = dto.reviewNotes;
    appeal.reviewedAt = new Date();
    
    const saved = await this.repo.save(appeal);
    this.logger.log(`IA decision appeal ${id} decision: ${dto.reviewDecision}`);
    return saved;
  }

  async escalate(id: string, dto: EscalateToBoardDto): Promise<IaDecisionAppeal> {
    const appeal = await this.findById(id);
    appeal.requiresBoardReview = true;
    appeal.escalatedAt = new Date();
    appeal.humanReviewNotes = dto.escalationReason;
    
    const saved = await this.repo.save(appeal);
    this.logger.warn(`IA decision appeal ${id} escalated to board: ${dto.urgencyLevel}`);
    return saved;
  }

  async getStats(): Promise<{
    totalAppeals: number;
    pendingReviews: number;
    underHumanReview: number;
    upheld: number;
    overturned: number;
    escalated: number;
    requiresBoardReview: number;
    avgConfidenceScore: number | null;
  }> {
    const totalAppeals = await this.repo.count();
    const pendingReviews = await this.repo.count({ where: { reviewStatus: 'pending_review' } });
    const underHumanReview = await this.repo.count({ where: { reviewStatus: 'under_human_review' } });
    const upheld = await this.repo.count({ where: { reviewStatus: 'upheld' } });
    const overturned = await this.repo.count({ where: { reviewStatus: 'overturned' } });
    const escalated = await this.repo.count({ where: { escalatedAt: Not(IsNull()) } });
    const requiresBoardReview = await this.repo.count({ where: { requiresBoardReview: true } });

    const allAppeals = await this.repo.find();
    const scores = allAppeals.map(a => a.confidenceScore).filter((s): s is number => s !== null);
    const avgConfidenceScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

    return {
      totalAppeals,
      pendingReviews,
      underHumanReview,
      upheld,
      overturned,
      escalated,
      requiresBoardReview,
      avgConfidenceScore,
    };
  }
}
