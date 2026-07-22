import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyntheticContentPolicy } from '../entities/synthetic-content-policy.entity';
import { CreatePolicyDto, EvaluateContentDto } from '../dto/synthetic-content-policy.dto';

@Injectable()
export class SyntheticContentPolicyService {
  private readonly logger = new Logger(SyntheticContentPolicyService.name);

  constructor(
    @InjectRepository(SyntheticContentPolicy)
    private readonly repo: Repository<SyntheticContentPolicy>,
  ) {}

  async create(dto: CreatePolicyDto): Promise<SyntheticContentPolicy> {
    const policy = new SyntheticContentPolicy();
    Object.assign(policy, dto);
    policy.status = dto.status ?? 'draft';
    policy.applicableTo = dto.applicableTo ?? 'all';
    policy.requirementLevel = dto.requirementLevel ?? 'mandatory';
    return this.repo.save(policy);
  }

  async findAll(status?: string): Promise<SyntheticContentPolicy[]> {
    if (status) return this.repo.find({ where: { status }, order: { createdAt: 'DESC' } });
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findActive(): Promise<SyntheticContentPolicy[]> {
    return this.repo.find({ where: { status: 'active' }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<SyntheticContentPolicy> {
    const policy = await this.repo.findOne({ where: { id } });
    if (!policy) throw new NotFoundException(`Policy ${id} not found`);
    return policy;
  }

  async activate(id: string): Promise<SyntheticContentPolicy> {
    const policy = await this.findById(id);
    policy.status = 'active';
    if (!policy.effectiveDate) policy.effectiveDate = new Date();
    return this.repo.save(policy);
  }

  async deactivate(id: string): Promise<SyntheticContentPolicy> {
    const policy = await this.findById(id);
    policy.status = 'deprecated';
    policy.expiresAt = new Date();
    return this.repo.save(policy);
  }

  async evaluateContent(dto: EvaluateContentDto): Promise<{
    compliant: boolean;
    appliedPolicy: string | null;
    requirementLevel: string | null;
    violations: string[];
    recommendation: string;
  }> {
    const policies = await this.findActive();
    const violations: string[] = [];
    let appliedPolicy: string | null = null;
    let requirementLevel: string | null = null;

    for (const policy of policies) {
      if (policy.blockedModels) {
        try {
          const blocked = JSON.parse(policy.blockedModels);
          if (Array.isArray(blocked) && blocked.includes(dto.modelName)) {
            violations.push(`Model ${dto.modelName} is blocked by policy ${policy.policyName}`);
          }
        } catch { /* ignore parse errors */ }
      }
      if (!appliedPolicy) {
        appliedPolicy = policy.policyName;
        requirementLevel = policy.requirementLevel;
      }
    }

    const compliant = violations.length === 0;

    return {
      compliant,
      appliedPolicy,
      requirementLevel,
      violations,
      recommendation: compliant
        ? 'Content complies with all active synthetic content policies'
        : `Content violates ${violations.length} policy rule(s)`,
    };
  }

  async getStats(): Promise<{
    totalPolicies: number;
    activePolicies: number;
    draftPolicies: number;
    deprecatedPolicies: number;
  }> {
    const totalPolicies = await this.repo.count();
    const activePolicies = await this.repo.count({ where: { status: 'active' } });
    const draftPolicies = await this.repo.count({ where: { status: 'draft' } });
    const deprecatedPolicies = await this.repo.count({ where: { status: 'deprecated' } });

    return { totalPolicies, activePolicies, draftPolicies, deprecatedPolicies };
  }
}
