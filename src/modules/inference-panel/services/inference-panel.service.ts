import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { InferenceLog } from '../entities/inference-log.entity';
import { PrivacyBudget } from '../entities/privacy-budget.entity';
import { PrivacyBudgetTransaction } from '../entities/privacy-budget-transaction.entity';
import {
  CreateInferenceLogDto,
  CreatePrivacyBudgetDto,
  UpdatePrivacyBudgetDto,
  CreateBudgetTransactionDto,
  InferenceQueryDto,
} from '../dto/inference-panel.dto';

@Injectable()
export class InferencePanelService {
  private readonly logger = new Logger(InferencePanelService.name);

  constructor(
    @InjectRepository(InferenceLog)
    private readonly inferenceLogRepo: Repository<InferenceLog>,
    @InjectRepository(PrivacyBudget)
    private readonly budgetRepo: Repository<PrivacyBudget>,
    @InjectRepository(PrivacyBudgetTransaction)
    private readonly transactionRepo: Repository<PrivacyBudgetTransaction>,
  ) {}

  async createInferenceLog(dto: CreateInferenceLogDto): Promise<InferenceLog> {
    const log = this.inferenceLogRepo.create({
      userId: dto.userId,
      modelVersionId: dto.modelVersionId,
      inferenceType: dto.inferenceType,
      dataSensitivity: dto.dataSensitivity ?? 'internal',
      inputHash: dto.inputHash,
      inputSummary: dto.inputSummary,
      outputSummary: dto.outputSummary,
      confidence: dto.confidence,
      latencyMs: dto.latencyMs ?? 0,
      dataSource: dto.dataSource,
      metadata: dto.metadata ?? null,
      status: 'pending',
    });

    const saved = await this.inferenceLogRepo.save(log);
    this.logger.log(`Inference log created: ${saved.id} for user ${dto.userId}`);

    await this.consumeBudgetOnInference(dto.userId, saved.id);

    saved.status = 'completed';
    saved.executedAt = new Date();
    return this.inferenceLogRepo.save(saved);
  }

  async findAllInferenceLogs(query?: InferenceQueryDto): Promise<{ items: InferenceLog[]; total: number }> {
    const limit = Math.min(query?.limit ?? 50, 200);
    const offset = query?.offset ?? 0;

    const findOptions: FindManyOptions<InferenceLog> = {
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    };

    if (query?.status || query?.inferenceType) {
      findOptions.where = {};
      if (query.status) (findOptions.where as any).status = query.status;
      if (query.inferenceType) (findOptions.where as any).inferenceType = query.inferenceType;
    }

    const [items, total] = await this.inferenceLogRepo.findAndCount(findOptions);
    return { items, total };
  }

  async findInferenceLogById(id: string): Promise<InferenceLog> {
    const log = await this.inferenceLogRepo.findOne({ where: { id } });
    if (!log) throw new NotFoundException(`Inference log ${id} not found`);
    return log;
  }

  async findInferenceLogsByUser(userId: string): Promise<InferenceLog[]> {
    return this.inferenceLogRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createBudget(dto: CreatePrivacyBudgetDto): Promise<PrivacyBudget> {
    const period = dto.period ?? 'monthly';
    const now = new Date();
    const periodEnd = this.calculatePeriodEnd(period, now);

    const budget = this.budgetRepo.create({
      userId: dto.userId,
      period,
      status: 'active',
      totalCredits: dto.totalCredits ?? 1000,
      consumedCredits: 0,
      refundedCredits: 0,
      periodStart: now,
      periodEnd,
      epsilonPerInference: dto.epsilonPerInference ?? 0.01,
      maxEpsilon: dto.maxEpsilon ?? 1.0,
      consumedEpsilon: 0,
      config: dto.config ?? null,
    });

    const saved = await this.budgetRepo.save(budget);
    this.logger.log(`Privacy budget created: ${saved.id} for user ${dto.userId}`);
    return saved;
  }

  async findAllBudgets(): Promise<PrivacyBudget[]> {
    return this.budgetRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findBudgetById(id: string): Promise<PrivacyBudget> {
    const budget = await this.budgetRepo.findOne({ where: { id } });
    if (!budget) throw new NotFoundException(`Privacy budget ${id} not found`);
    return budget;
  }

  async findBudgetByUser(userId: string): Promise<PrivacyBudget> {
    const budget = await this.budgetRepo.findOne({
      where: { userId, status: 'active' },
      order: { createdAt: 'DESC' },
    });
    if (!budget) throw new NotFoundException(`No active budget found for user ${userId}`);
    return budget;
  }

  async updateBudget(id: string, dto: UpdatePrivacyBudgetDto): Promise<PrivacyBudget> {
    const budget = await this.findBudgetById(id);

    if (dto.status !== undefined) budget.status = dto.status;
    if (dto.totalCredits !== undefined) budget.totalCredits = dto.totalCredits;
    if (dto.epsilonPerInference !== undefined) budget.epsilonPerInference = dto.epsilonPerInference;
    if (dto.maxEpsilon !== undefined) budget.maxEpsilon = dto.maxEpsilon;

    if (budget.consumedCredits >= budget.totalCredits) {
      budget.status = 'exhausted';
    }

    return this.budgetRepo.save(budget);
  }

  async resetBudgetPeriod(id: string): Promise<PrivacyBudget> {
    const budget = await this.findBudgetById(id);
    const now = new Date();

    budget.consumedCredits = 0;
    budget.refundedCredits = 0;
    budget.consumedEpsilon = 0;
    budget.status = 'active';
    budget.periodStart = now;
    budget.periodEnd = this.calculatePeriodEnd(budget.period, now);

    this.logger.log(`Budget period reset: ${id}`);
    return this.budgetRepo.save(budget);
  }

  async createTransaction(budgetId: string, dto: CreateBudgetTransactionDto): Promise<PrivacyBudgetTransaction> {
    const budget = await this.findBudgetById(budgetId);

    if (budget.status !== 'active') {
      throw new BadRequestException(`Budget ${budgetId} is not active (status: ${budget.status})`);
    }

    const credits = dto.creditsAmount ?? 1;
    const epsilon = dto.epsilonAmount ?? budget.epsilonPerInference;

    if (dto.transactionType === 'consumption') {
      if (budget.consumedCredits + credits > budget.totalCredits) {
        budget.status = 'exhausted';
        await this.budgetRepo.save(budget);
        throw new BadRequestException(
          `Budget exhausted: ${budget.consumedCredits}/${budget.totalCredits} credits consumed`,
        );
      }
      if (budget.consumedEpsilon + epsilon > budget.maxEpsilon) {
        throw new BadRequestException(
          `Epsilon budget exceeded: ${budget.consumedEpsilon}/${budget.maxEpsilon}`,
        );
      }

      budget.consumedCredits += credits;
      budget.consumedEpsilon += epsilon;
    } else if (dto.transactionType === 'refund') {
      budget.consumedCredits = Math.max(0, budget.consumedCredits - credits);
      budget.refundedCredits += credits;
      budget.consumedEpsilon = Math.max(0, budget.consumedEpsilon - epsilon);
    } else if (dto.transactionType === 'allocation') {
      budget.totalCredits += credits;
    }

    await this.budgetRepo.save(budget);

    const transaction = new PrivacyBudgetTransaction();
    transaction.budgetId = budgetId;
    transaction.userId = dto.userId;
    transaction.transactionType = dto.transactionType;
    transaction.creditsAmount = credits;
    transaction.epsilonAmount = epsilon;
    transaction.inferenceLogId = (dto.inferenceLogId ?? null) as any;
    transaction.reason = (dto.reason ?? null) as any;
    transaction.metadata = null;

    const saved = await this.transactionRepo.save(transaction);
    this.logger.log(`Transaction created: ${saved.id} (type: ${dto.transactionType}, credits: ${credits})`);
    return saved;
  }

  async findTransactionsByBudget(budgetId: string): Promise<PrivacyBudgetTransaction[]> {
    return this.transactionRepo.find({
      where: { budgetId },
      order: { createdAt: 'DESC' },
    });
  }

  async findTransactionById(id: string): Promise<PrivacyBudgetTransaction> {
    const tx = await this.transactionRepo.findOne({ where: { id } });
    if (!tx) throw new NotFoundException(`Transaction ${id} not found`);
    return tx;
  }

  async getStats(): Promise<{
    totalInferences: number;
    pendingInferences: number;
    completedInferences: number;
    activeBudgets: number;
    exhaustedBudgets: number;
    totalCreditsConsumed: number;
  }> {
    const totalInferences = await this.inferenceLogRepo.count();
    const pendingInferences = await this.inferenceLogRepo.count({ where: { status: 'pending' } });
    const completedInferences = await this.inferenceLogRepo.count({ where: { status: 'completed' } });
    const activeBudgets = await this.budgetRepo.count({ where: { status: 'active' } });
    const exhaustedBudgets = await this.budgetRepo.count({ where: { status: 'exhausted' } });

    const budgets = await this.budgetRepo.find();
    const totalCreditsConsumed = budgets.reduce((sum, b) => sum + b.consumedCredits, 0);

    return {
      totalInferences,
      pendingInferences,
      completedInferences,
      activeBudgets,
      exhaustedBudgets,
      totalCreditsConsumed,
    };
  }

  private async consumeBudgetOnInference(userId: string, inferenceLogId: string): Promise<void> {
    try {
      const budget = await this.budgetRepo.findOne({
        where: { userId, status: 'active' },
        order: { createdAt: 'DESC' },
      });

      if (!budget) {
        this.logger.warn(`No active budget for user ${userId}, skipping budget consumption`);
        return;
      }

      const credits = 1;
      const epsilon = budget.epsilonPerInference;

      if (budget.consumedCredits + credits > budget.totalCredits) {
        budget.status = 'exhausted';
        await this.budgetRepo.save(budget);
        this.logger.warn(`Budget ${budget.id} exhausted during inference ${inferenceLogId}`);
        return;
      }

      if (budget.consumedEpsilon + epsilon > budget.maxEpsilon) {
        this.logger.warn(`Epsilon budget exceeded for user ${userId}, skipping consumption`);
        return;
      }

      budget.consumedCredits += credits;
      budget.consumedEpsilon += epsilon;
      await this.budgetRepo.save(budget);

      const tx = new PrivacyBudgetTransaction();
      tx.budgetId = budget.id;
      tx.userId = userId;
      tx.transactionType = 'consumption';
      tx.creditsAmount = credits;
      tx.epsilonAmount = epsilon;
      tx.inferenceLogId = inferenceLogId;
      tx.reason = 'Automatic consumption from inference';
      tx.metadata = null;
      await this.transactionRepo.save(tx);
    } catch (error: any) {
      this.logger.error(`Failed to consume budget: ${error.message}`);
    }
  }

  private calculatePeriodEnd(period: string, start: Date): Date {
    const end = new Date(start);
    switch (period) {
      case 'daily':
        end.setDate(end.getDate() + 1);
        break;
      case 'weekly':
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'quarterly':
        end.setMonth(end.getMonth() + 3);
        break;
      default:
        end.setMonth(end.getMonth() + 1);
    }
    return end;
  }
}
