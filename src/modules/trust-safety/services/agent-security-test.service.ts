import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentSecurityTest } from '../entities/agent-security-test.entity';
import { AgentSecurityResult } from '../entities/agent-security-result.entity';
import { CreateAgentSecurityTestDto, RegisterResultDto } from '../dto/agent-security-test.dto';

@Injectable()
export class AgentSecurityTestService {
  private readonly logger = new Logger(AgentSecurityTestService.name);

  constructor(
    @InjectRepository(AgentSecurityTest)
    private readonly testRepo: Repository<AgentSecurityTest>,
    @InjectRepository(AgentSecurityResult)
    private readonly resultRepo: Repository<AgentSecurityResult>,
  ) {}

  async createTest(dto: CreateAgentSecurityTestDto): Promise<AgentSecurityTest> {
    const test = new AgentSecurityTest();
    Object.assign(test, dto);
    test.status = 'pending';
    return this.testRepo.save(test);
  }

  async startTest(id: string): Promise<AgentSecurityTest> {
    const test = await this.findById(id);
    test.status = 'running';
    test.startedAt = new Date();
    return this.testRepo.save(test);
  }

  async completeTest(id: string): Promise<AgentSecurityTest> {
    const test = await this.findById(id);
    test.status = 'completed';
    test.completedAt = new Date();
    if (test.startedAt) {
      test.durationMs = test.completedAt.getTime() - test.startedAt.getTime();
    }
    return this.testRepo.save(test);
  }

  async registerResult(dto: RegisterResultDto): Promise<AgentSecurityResult> {
    const result = new AgentSecurityResult();
    Object.assign(result, dto);
    const saved = await this.resultRepo.save(result);

    // Update test status
    const test = await this.findById(dto.testId);
    test.status = dto.overallResult === 'pass' ? 'completed' : 'failed';
    test.completedAt = new Date();
    if (test.startedAt) {
      test.durationMs = test.completedAt.getTime() - test.startedAt.getTime();
    }
    await this.testRepo.save(test);

    this.logger.log(`Security test ${dto.testId} result: ${dto.overallResult} (${dto.findingsCount || 0} findings)`);
    return saved;
  }

  async findById(id: string): Promise<AgentSecurityTest> {
    const test = await this.testRepo.findOne({ where: { id } });
    if (!test) throw new NotFoundException(`Security test ${id} not found`);
    return test;
  }

  async findByAgent(agentId: string): Promise<AgentSecurityTest[]> {
    return this.testRepo.find({ where: { agentId }, order: { createdAt: 'DESC' } });
  }

  async findResults(testId: string): Promise<AgentSecurityResult[]> {
    return this.resultRepo.find({ where: { testId }, order: { createdAt: 'DESC' } });
  }

  async findAll(status?: string): Promise<AgentSecurityTest[]> {
    if (status) return this.testRepo.find({ where: { status }, order: { createdAt: 'DESC' } });
    return this.testRepo.find({ order: { createdAt: 'DESC' } });
  }

  async cancelTest(id: string): Promise<AgentSecurityTest> {
    const test = await this.findById(id);
    test.status = 'cancelled';
    return this.testRepo.save(test);
  }

  async getStats(): Promise<{
    totalTests: number;
    byStatus: Record<string, number>;
    byResult: Record<string, number>;
    avgSecurityScore: number | null;
    totalFindings: number;
    criticalFindings: number;
  }> {
    const totalTests = await this.testRepo.count();
    const allTests = await this.testRepo.find();
    const byStatus: Record<string, number> = {};
    allTests.forEach(t => { byStatus[t.status] = (byStatus[t.status] || 0) + 1; });

    const allResults = await this.resultRepo.find();
    const byResult: Record<string, number> = {};
    let totalFindings = 0;
    let criticalFindings = 0;
    const scores: number[] = [];

    allResults.forEach(r => {
      byResult[r.overallResult] = (byResult[r.overallResult] || 0) + 1;
      totalFindings += r.findingsCount || 0;
      criticalFindings += r.criticalFindings || 0;
      if (r.securityScore !== null) scores.push(r.securityScore);
    });

    return {
      totalTests,
      byStatus,
      byResult,
      avgSecurityScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
      totalFindings,
      criticalFindings,
    };
  }
}
