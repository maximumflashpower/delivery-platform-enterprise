import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyntheticContentMarking } from '../entities/synthetic-content-marking.entity';
import { ApplyWatermarkDto, DetectWatermarkDto } from '../dto/synthetic-content-marking.dto';
import * as crypto from 'crypto';

@Injectable()
export class SyntheticContentMarkingService {
  private readonly logger = new Logger(SyntheticContentMarkingService.name);

  constructor(
    @InjectRepository(SyntheticContentMarking)
    private readonly repo: Repository<SyntheticContentMarking>,
  ) {}

  async applyWatermark(dto: ApplyWatermarkDto): Promise<SyntheticContentMarking> {
    const marking = new SyntheticContentMarking();
    marking.contentId = dto.contentId;
    marking.contentType = dto.contentType;
    marking.modelId = dto.modelId;
    marking.modelName = dto.modelName;
    marking.riskLevel = dto.riskLevel;
    marking.confidenceScore = dto.confidenceScore ?? null;
    marking.metadata = dto.metadata ?? null;
    marking.watermarkVersion = 'v1.0';

    const payload = `${dto.contentId}-${dto.modelId}-${Date.now()}`;
    marking.watermarkHash = crypto.createHash('sha256').update(payload).digest('hex').substring(0, 64);
    marking.watermarkPayload = payload;
    marking.markedAt = new Date();
    marking.status = 'active';

    const saved = await this.repo.save(marking);
    this.logger.log(`Watermark applied to content ${dto.contentId} (risk: ${dto.riskLevel})`);
    return saved;
  }

  async detectWatermark(dto: DetectWatermarkDto): Promise<{ detected: boolean; contentId: string | null; confidence: number; riskLevel: string | null }> {
    const hash = crypto.createHash('sha256').update(dto.contentSample).digest('hex').substring(0, 64);
    const match = await this.repo.findOne({ where: { watermarkHash: hash } });

    if (match) {
      match.detectedAt = new Date();
      await this.repo.save(match);
      return {
        detected: true,
        contentId: match.contentId,
        confidence: match.confidenceScore ?? 0.5,
        riskLevel: match.riskLevel,
      };
    }

    return { detected: false, contentId: null, confidence: 0, riskLevel: null };
  }

  async findByContent(contentId: string): Promise<SyntheticContentMarking[]> {
    return this.repo.find({ where: { contentId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<SyntheticContentMarking> {
    const marking = await this.repo.findOne({ where: { id } });
    if (!marking) throw new NotFoundException(`Synthetic content marking ${id} not found`);
    return marking;
  }

  async findAll(status?: string): Promise<SyntheticContentMarking[]> {
    if (status) return this.repo.find({ where: { status }, order: { createdAt: 'DESC' } });
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async flagSuspiciousContent(markingId: string): Promise<SyntheticContentMarking> {
    const marking = await this.findById(markingId);
    marking.status = 'flagged';
    return this.repo.save(marking);
  }

  async removeMarking(markingId: string): Promise<SyntheticContentMarking> {
    const marking = await this.findById(markingId);
    marking.status = 'removed';
    return this.repo.save(marking);
  }

  async getStats(): Promise<{
    totalMarked: number;
    byContentType: Record<string, number>;
    byRiskLevel: Record<string, number>;
    activeMarkers: number;
    flaggedContent: number;
    removedMarkers: number;
    avgConfidence: number | null;
  }> {
    const totalMarked = await this.repo.count();
    const activeMarkers = await this.repo.count({ where: { status: 'active' } });
    const flaggedContent = await this.repo.count({ where: { status: 'flagged' } });
    const removedMarkers = await this.repo.count({ where: { status: 'removed' } });

    const allMarkings = await this.repo.find();
    const byContentType: Record<string, number> = {};
    const byRiskLevel: Record<string, number> = {};
    const scores: number[] = [];

    allMarkings.forEach(m => {
      byContentType[m.contentType] = (byContentType[m.contentType] || 0) + 1;
      byRiskLevel[m.riskLevel] = (byRiskLevel[m.riskLevel] || 0) + 1;
      if (m.confidenceScore !== null) scores.push(m.confidenceScore);
    });

    return {
      totalMarked,
      byContentType,
      byRiskLevel,
      activeMarkers,
      flaggedContent,
      removedMarkers,
      avgConfidence: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
    };
  }
}
