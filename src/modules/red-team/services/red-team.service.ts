import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { RedTeamTest } from '../entities/red-team-test.entity';
import { RedTeamFinding } from '../entities/red-team-finding.entity';
import {
  CreateRedTeamTestDto,
  UpdateTestResultDto,
  CreateFindingDto,
  ResolveFindingDto,
  ListTestsQueryDto,
} from '../dto/red-team.dto';

@Injectable()
export class RedTeamService {
  private readonly logger = new Logger(RedTeamService.name);

  constructor(
    @InjectRepository(RedTeamTest)
    private readonly testRepo: Repository<RedTeamTest>,
    @InjectRepository(RedTeamFinding)
    private readonly findingRepo: Repository<RedTeamFinding>,
  ) {}

  async createTest(executedBy: string, dto: CreateRedTeamTestDto): Promise<RedTeamTest> {
    const test = new RedTeamTest();
    test.modelId = dto.modelId;
    test.modelName = dto.modelName;
    test.attackVector = dto.attackVector;
    test.status = 'pending';
    test.severity = dto.severity ?? 'info';
    test.prompt = dto.prompt;
    test.expectedBehavior = dto.expectedBehavior ?? null;
    test.actualResponse = null;
    test.passed = false;
    test.autoRemediate = dto.autoRemediate ?? false;
    test.remediationStatus = null;
    test.remediationNotes = null;
    test.metadata = dto.metadata ? JSON.stringify(dto.metadata) : null;
    test.executedBy = executedBy;
    test.startedAt = null;
    test.completedAt = null;

    const saved = await this.testRepo.save(test);
    this.logger.log(`Red-team test created: ${saved.id} for model ${dto.modelId}`);
    return saved;
  }

  async findAllTests(query?: ListTestsQueryDto): Promise<{ items: RedTeamTest[]; total: number }> {
    const limit = Math.min(parseInt(query?.limit ?? '50', 10), 200);
    const offset = parseInt(query?.offset ?? '0', 10);

    const findOptions: FindManyOptions<RedTeamTest> = {
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    };

    const where: any = {};
    if (query?.modelId) where.modelId = query.modelId;
    if (query?.attackVector) where.attackVector = query.attackVector;
    if (query?.status) where.status = query.status;
    if (query?.severity) where.severity = query.severity;
    findOptions.where = where;

    const [items, total] = await this.testRepo.findAndCount(findOptions);
    return { items, total };
  }

  async findTestById(id: string): Promise<RedTeamTest> {
    const test = await this.testRepo.findOne({ where: { id } });
    if (!test) throw new NotFoundException(`Red-team test ${id} not found`);
    return test;
  }

  async executeTest(id: string): Promise<RedTeamTest> {
    const test = await this.findTestById(id);
    test.status = 'running';
    test.startedAt = new Date();
    await this.testRepo.save(test);
    this.logger.log(`Red-team test execution started: ${id}`);
    return test;
  }

  async updateTestResult(id: string, dto: UpdateTestResultDto): Promise<RedTeamTest> {
    const test = await this.findTestById(id);
    test.actualResponse = dto.actualResponse;
    test.passed = dto.passed;
    test.status = dto.passed ? 'completed' : 'failed';
    test.severity = dto.severity ?? test.severity;
    test.remediationStatus = dto.remediationStatus ?? test.remediationStatus;
    test.remediationNotes = dto.remediationNotes ?? test.remediationNotes;
    test.completedAt = new Date();

    const saved = await this.testRepo.save(test);
    this.logger.log(`Red-team test ${id} result: ${dto.passed ? 'PASSED' : 'FAILED'}`);
    return saved;
  }

  async deleteTest(id: string): Promise<void> {
    const result = await this.testRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Test ${id} not found`);
  }

  async createFinding(dto: CreateFindingDto): Promise<RedTeamFinding> {
    const finding = new RedTeamFinding();
    finding.testId = dto.testId;
    finding.modelId = dto.modelId;
    finding.findingType = dto.findingType;
    finding.severity = dto.severity;
    finding.description = dto.description;
    finding.evidence = dto.evidence ?? null;
    finding.isResolved = false;
    finding.resolvedAt = null;
    finding.resolutionNotes = null;

    const saved = await this.findingRepo.save(finding);
    this.logger.log(`Finding created: ${saved.id} for test ${dto.testId} severity ${dto.severity}`);
    return saved;
  }

  async findFindingsByTest(testId: string): Promise<RedTeamFinding[]> {
    return this.findingRepo.find({
      where: { testId },
      order: { severity: 'ASC', createdAt: 'DESC' },
    });
  }

  async findAllFindings(modelId?: string): Promise<{ items: RedTeamFinding[]; total: number }> {
    const findOptions: FindManyOptions<RedTeamFinding> = {
      order: { createdAt: 'DESC' },
    };
    if (modelId) {
      findOptions.where = { modelId };
    }
    const [items, total] = await this.findingRepo.findAndCount(findOptions);
    return { items, total };
  }

  async resolveFinding(id: string, dto: ResolveFindingDto): Promise<RedTeamFinding> {
    const finding = await this.findingRepo.findOne({ where: { id } });
    if (!finding) throw new NotFoundException(`Finding ${id} not found`);

    finding.isResolved = true;
    finding.resolvedAt = new Date();
    finding.resolutionNotes = dto.resolutionNotes;

    return this.findingRepo.save(finding);
  }

  async getStats(): Promise<{
    totalTests: number;
    passedTests: number;
    failedTests: number;
    pendingTests: number;
    totalFindings: number;
    criticalFindings: number;
    unresolvedFindings: number;
  }> {
    const totalTests = await this.testRepo.count();
    const passedTests = await this.testRepo.count({ where: { status: 'completed' } });
    const failedTests = await this.testRepo.count({ where: { status: 'failed' } });
    const pendingTests = await this.testRepo.count({ where: { status: 'pending' } });

    const totalFindings = await this.findingRepo.count();
    const criticalFindings = await this.findingRepo.count({ where: { severity: 'critical' } });
    const unresolvedFindings = await this.findingRepo.count({ where: { isResolved: false } });

    return {
      totalTests,
      passedTests,
      failedTests,
      pendingTests,
      totalFindings,
      criticalFindings,
      unresolvedFindings,
    };
  }
}
