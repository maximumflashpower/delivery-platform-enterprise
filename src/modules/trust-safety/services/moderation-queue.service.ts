import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ModerationQueueItem } from '../entities/moderation-queue-item.entity';
import { ReportContentDto } from '../dto/report-content.dto';
import { UpdateModerationStatusDto } from '../dto/update-moderation-status.dto';

@Injectable()
export class ModerationQueueService {
  constructor(
    @InjectRepository(ModerationQueueItem)
    private readonly repo: Repository<ModerationQueueItem>,
  ) {}

  async report(dto: ReportContentDto): Promise<ModerationQueueItem> {
    const item = new ModerationQueueItem();
    item.contentId = dto.contentId;
    item.contentType = dto.contentType as any;
    item.reportedByUserId = dto.reportedByUserId;
    item.flaggedUserId = dto.flaggedUserId || null;
    item.reasonCode = dto.reasonCode;
    item.reasonDescription = dto.reasonDescription || '';
    item.evidence = dto.evidence || '';
    item.status = 'pending';
    item.priority = dto.priority ? parseInt(dto.priority) : 0;
    return this.repo.save(item);
  }

  async getQueue(status?: string, limit: number = 50): Promise<ModerationQueueItem[]> {
    if (status) {
      return this.repo.find({
        where: { status: status as any },
        order: { priority: 'DESC', createdAt: 'ASC' },
        take: limit,
      });
    }
    return this.repo.find({
      where: { status: 'pending' },
      order: { priority: 'DESC', createdAt: 'ASC' },
      take: limit,
    });
  }

  async getById(id: string): Promise<ModerationQueueItem> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Queue item ${id} not found`);
    return item;
  }

  async updateStatus(id: string, dto: UpdateModerationStatusDto): Promise<ModerationQueueItem> {
    const item = await this.getById(id);
    
    if (dto.status) item.status = dto.status as any;
    if (dto.moderatorId) item.moderatorId = dto.moderatorId;
    if (dto.moderatorNotes) item.moderatorNotes = dto.moderatorNotes;
    if (dto.actionTaken) item.actionTaken = dto.actionTaken as any;
    if (dto.status && dto.status !== 'pending') item.reviewedAt = new Date();
    item.updatedAt = new Date();
    
    return this.repo.save(item);
  }

  async escalate(id: string, reason: string, moderatorId: string): Promise<ModerationQueueItem> {
    const item = await this.getById(id);
    item.status = 'escalated';
    item.moderatorNotes = `${item.moderatorNotes || ''}\nEscalated: ${reason}`;
    item.moderatorId = moderatorId;
    item.reviewedAt = new Date();
    return this.repo.save(item);
  }

  async getStats(): Promise<{ pending: number; in_review: number; resolved: number; total_today: number }> {
    const pending = await this.repo.count({ where: { status: 'pending' } });
    const in_review = await this.repo.count({ where: { status: 'in_review' } });
    const resolved = await this.repo.count({ 
      where: { status: In(['approved', 'rejected', 'removed']) }
    });
    // Simplificado sin gte
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const total_today = await this.repo.createQueryBuilder('m')
      .where('DATE(m.createdAt) >= DATE(:today)', { today })
      .getCount();
    return { pending, in_review, resolved, total_today };
  }
}
