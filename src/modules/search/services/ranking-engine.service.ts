import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankingModel, RankingStrategy, ModelStatus } from '../entities/ranking-model.entity';
import { RankingResult } from '../entities/ranking-result.entity';
import { InterestSignalService } from './interest-signal.service';

export interface RankInput {
  userId: string;
  entityIds: string[];
  entityType: string;
  contextQuery?: string;
}

@Injectable()
export class RankingEngineService {
  constructor(
    @InjectRepository(RankingModel)
    private readonly modelRepo: Repository<RankingModel>,
    @InjectRepository(RankingResult)
    private readonly resultRepo: Repository<RankingResult>,
    private readonly signalService: InterestSignalService,
  ) {}

  async createModel(data: Partial<RankingModel>): Promise<RankingModel> {
    return this.modelRepo.save(this.modelRepo.create(data));
  }

  async findActiveModel(entityType?: string): Promise<RankingModel> {
    const query = this.modelRepo.createQueryBuilder('m')
      .where('m.status = :status', { status: ModelStatus.ACTIVE });

    if (entityType) {
      query.andWhere('(m.target_entity_type = :type OR m.target_entity_type IS NULL)', { type: entityType });
    }

    query.orderBy('m.updatedAt', 'DESC').limit(1);

    const model = await query.getOne();
    if (!model) throw new NotFoundException('No active ranking model found');
    return model;
  }

  async findAllModels(): Promise<RankingModel[]> {
    return this.modelRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOneModel(id: string): Promise<RankingModel> {
    const model = await this.modelRepo.findOne({ where: { id } });
    if (!model) throw new NotFoundException(`Model ${id} not found`);
    return model;
  }

  async updateModel(id: string, updates: Partial<RankingModel>): Promise<RankingModel> {
    const model = await this.findOneModel(id);
    Object.assign(model, updates);
    return this.modelRepo.save(model);
  }

  async activateModel(id: string): Promise<RankingModel> {
    const model = await this.findOneModel(id);
    model.status = ModelStatus.ACTIVE;
    return this.modelRepo.save(model);
  }

  async rank(input: RankInput): Promise<RankingResult[]> {
    const model = await this.findActiveModel(input.entityType);
    const results: RankingResult[] = [];

    const userSignals = await this.signalService.getUserSignalProfile(input.userId);

    for (let i = 0; i < input.entityIds.length; i++) {
      const entityId = input.entityIds[i];

      const popScore = await this.signalService.getEntityPopularity(entityId);
      const collabScore = this.computeCollaborativeScore(userSignals, input.entityType);
      const contentScore = this.computeContentScore(userSignals, input.entityType);
      const recencyScore = this.computeRecencyScore();
      const persScore = this.computePersonalizationScore(userSignals);

      const hybridScore =
        collabScore * model.weight_collaborative +
        contentScore * model.weight_content +
        (popScore / 10) * model.weight_popularity +
        recencyScore * model.weight_recency +
        persScore * model.weight_personalization;

      const normalizedScore = hybridScore / (
        model.weight_collaborative + model.weight_content + model.weight_popularity +
        model.weight_recency + model.weight_personalization
      );

      results.push(
        this.resultRepo.create({
          modelId: model.id,
          userId: input.userId,
          entityId,
          entity_type: input.entityType,
          score: normalizedScore,
          collaborative_score: collabScore,
          content_score: contentScore,
          popularity_score: popScore,
          recency_score: recencyScore,
          personalization_score: persScore,
          rank_position: i + 1,
          context_query: input.contextQuery,
          explanation: `hybrid(${model.strategy}): collab=${collabScore.toFixed(2)}, content=${contentScore.toFixed(2)}, pop=${(popScore/10).toFixed(2)}, recency=${recencyScore.toFixed(2)}, pers=${persScore.toFixed(2)}`
        })
      );
    }

    results.sort((a, b) => b.score - a.score);
    results.forEach((r, idx) => r.rank_position = idx + 1);

    await this.resultRepo.save(results);
    return results;
  }

  private computeCollaborativeScore(profile: Record<string, number>, entityType: string): number {
    const relevant = Object.entries(profile).filter(([k]) => k.startsWith(`${entityType}:`));
    if (relevant.length === 0) return 0;
    const sum = relevant.reduce((acc, [, v]) => acc + v, 0);
    return Math.min(sum / (relevant.length * 5), 1.0);
  }

  private computeContentScore(profile: Record<string, number>, entityType: string): number {
    const viewKey = `${entityType}:view`;
    const saveKey = `${entityType}:save`;
    const reviewKey = `${entityType}:review`;
    return Math.min(((profile[viewKey] || 0) * 0.1 + (profile[saveKey] || 0) * 0.5 + (profile[reviewKey] || 0) * 0.3), 1.0);
  }

  private computeRecencyScore(): number {
    return 0.5 + Math.random() * 0.5;
  }

  private computePersonalizationScore(profile: Record<string, number>): number {
    const totalSignals = Object.values(profile).reduce((a, b) => a + b, 0);
    return Math.min(totalSignals / 100, 1.0);
  }

  async getRankingHistory(userId: string, limit = 50): Promise<RankingResult[]> {
    return this.resultRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async getTopRanked(userId: string, limit = 10): Promise<RankingResult[]> {
    return this.resultRepo.find({
      where: { userId },
      order: { score: 'DESC' },
      take: limit
    });
  }
}
