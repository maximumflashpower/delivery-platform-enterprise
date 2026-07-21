import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Appeal } from '../entities/appeal.entity';
import { CreateAppealDto } from '../dto/create-appeal.dto';
import { UpdateAppealStatusDto } from '../dto/update-appeal-status.dto';

@Injectable()
export class AppealService {
  constructor(
    @InjectRepository(Appeal)
    private readonly repo: Repository<Appeal>,
  ) {}

  async create(dto: CreateAppealDto): Promise<Appeal> {
    // Check if appeal already exists for this claim
    const existing = await this.repo.findOne({
      where: { claimId: dto.claimId, userId: dto.userId, status: Not(In(['withdrawn'])) }
    });
    if (existing) throw new BadRequestException('An active appeal already exists for this claim');

    const appeal = new Appeal();
    appeal.claimId = dto.claimId;
    appeal.userId = dto.userId;
    appeal.appealType = dto.appealType as any;
    appeal.groundsForAppeal = dto.groundsForAppeal;
    appeal.additionalEvidence = dto.additionalEvidence || '';
    appeal.version = dto.version || 1;
    appeal.status = 'submitted';
    return this.repo.save(appeal);
  }

  async findByClaim(claimId: string): Promise<Appeal[]> {
    return this.repo.find({
      where: { claimId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Appeal[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Appeal> {
    const appeal = await this.repo.findOne({ where: { id } });
    if (!appeal) throw new NotFoundException(`Appeal ${id} not found`);
    return appeal;
  }

  async updateStatus(id: string, dto: UpdateAppealStatusDto): Promise<Appeal> {
    const appeal = await this.findById(id);
    
    Object.assign(appeal, dto);
    if (dto.status) appeal.status = dto.status as any;
    if (dto.reviewerId) appeal.reviewerId = dto.reviewerId;
    if (dto.reviewerDecision) appeal.reviewerDecision = dto.reviewerDecision;
    if (dto.outcomeExplanation) appeal.outcomeExplanation = dto.outcomeExplanation;
    
    if (['accepted', 'rejected'].includes(appeal.status)) {
      appeal.reviewedAt = new Date();
      appeal.resolvedAt = new Date();
    }
    
    appeal.version += 1;
    appeal.updatedAt = new Date();
    return this.repo.save(appeal);
  }

  async withdraw(id: string, userId: string): Promise<Appeal> {
    const appeal = await this.findById(id);
    if (appeal.userId !== userId) {
      throw new BadRequestException('Unauthorized to withdraw this appeal');
    }
    if (appeal.status !== 'submitted' && appeal.status !== 'under_review') {
      throw new BadRequestException('Cannot withdraw appeal that has been resolved');
    }
    appeal.status = 'withdrawn';
    appeal.updatedAt = new Date();
    return this.repo.save(appeal);
  }

  async incrementVersion(id: string, additionalEvidence: string): Promise<Appeal> {
    const appeal = await this.findById(id);
    appeal.version += 1;
    appeal.additionalEvidence = `${appeal.additionalEvidence}\n\n[V${appeal.version}] ${additionalEvidence}`;
    appeal.updatedAt = new Date();
    return this.repo.save(appeal);
  }
}
