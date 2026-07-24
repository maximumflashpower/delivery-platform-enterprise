import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { IncomeProtectionPolicy, PolicyStatus } from '../entities/income-protection-policy.entity';
import { ProtectionClaim, ClaimResolution } from '../entities/protection-claim.entity';
import { CreateIncomeProtectionPolicyDto, FileClaimDto, ReviewClaimDto } from '../dto/income-protection.dto';

@Injectable()
export class IncomeProtectionService {
  private readonly logger = new Logger(IncomeProtectionService.name);

  constructor(
    @InjectRepository(IncomeProtectionPolicy)
    private readonly policyRepo: Repository<IncomeProtectionPolicy>,
    @InjectRepository(ProtectionClaim)
    private readonly claimRepo: Repository<ProtectionClaim>,
  ) {}

  async createPolicy(dto: CreateIncomeProtectionPolicyDto): Promise<IncomeProtectionPolicy> {
    const policy = this.policyRepo.create({
      ...dto,
      effectiveDate: new Date(dto.effectiveDate),
      expirationDate: new Date(dto.expirationDate),
      status: PolicyStatus.DRAFT,
      totalPremiumsPaid: 0,
      totalClaimsPaid: 0,
      claimsFiled: 0,
    });
    return this.policyRepo.save(policy);
  }

  async findPolicyById(id: string): Promise<IncomeProtectionPolicy> {
    const policy = await this.policyRepo.findOne({ where: { id } });
    if (!policy) throw new NotFoundException(`Policy ${id} not found`);
    return policy;
  }

  async listPolicies(merchantId?: string, status?: PolicyStatus, page = 1, limit = 20): Promise<{ total: number; items: IncomeProtectionPolicy[] }> {
    const where: any = { deletedAt: IsNull() };
    if (merchantId) where.merchantId = merchantId;
    if (status) where.status = status;

    const [items, total] = await this.policyRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { total, items };
  }

  async activatePolicy(id: string): Promise<IncomeProtectionPolicy> {
    const policy = await this.findPolicyById(id);
    if (policy.status !== PolicyStatus.DRAFT) {
      throw new BadRequestException('Only draft policies can be activated');
    }
    policy.status = PolicyStatus.ACTIVE;
    return this.policyRepo.save(policy);
  }

  async suspendPolicy(id: string): Promise<IncomeProtectionPolicy> {
    const policy = await this.findPolicyById(id);
    if (policy.status !== PolicyStatus.ACTIVE) {
      throw new BadRequestException('Only active policies can be suspended');
    }
    policy.status = PolicyStatus.SUSPENDED;
    return this.policyRepo.save(policy);
  }

  async cancelPolicy(id: string): Promise<IncomeProtectionPolicy> {
    const policy = await this.findPolicyById(id);
    policy.status = PolicyStatus.CANCELLED;
    return this.policyRepo.save(policy);
  }

  async updateStatus(id: string, status: PolicyStatus): Promise<IncomeProtectionPolicy> {
    const policy = await this.findPolicyById(id);
    policy.status = status;
    return this.policyRepo.save(policy);
  }

  async fileClaim(policyId: string, dto: FileClaimDto): Promise<ProtectionClaim> {
    const policy = await this.findPolicyById(policyId);
    
    if (policy.status !== PolicyStatus.ACTIVE) {
      throw new BadRequestException('Can only file claims on active policies');
    }

    const incidentDate = new Date(dto.incidentDate);
    const effectiveDate = new Date(policy.effectiveDate);
    const waitingEnd = new Date(effectiveDate.getTime() + Number(policy.waitingPeriodDays) * 24 * 60 * 60 * 1000);
    
    if (incidentDate < waitingEnd) {
      throw new BadRequestException(`Incident occurred during waiting period (${policy.waitingPeriodDays} days)`);
    }

    if (dto.claimedAmount > Number(policy.coverageAmount)) {
      throw new BadRequestException(`Claimed amount exceeds coverage limit of ${policy.coverageAmount}`);
    }

    const claim = this.claimRepo.create({
      policyId,
      claimantId: policy.merchantId,
      claimTitle: dto.claimTitle,
      claimDescription: dto.claimDescription,
      claimedAmount: dto.claimedAmount,
      incidentDate: new Date(dto.incidentDate),
      filedDate: new Date(),
      status: 'filed',
      resolution: ClaimResolution.PENDING,
      deductibleApplied: dto.claimedAmount * (Number(policy.deductiblePercent) / 100),
      evidence: dto.evidence || null,
    });

    const saved = await this.claimRepo.save(claim);
    
    policy.claimsFiled += 1;
    policy.lastClaimDate = new Date();
    await this.policyRepo.save(policy);

    this.logger.log(`Claim filed for policy ${policyId}: ${dto.claimedAmount} ${policy.currency}`);
    return saved;
  }

  async getClaims(policyId: string): Promise<ProtectionClaim[]> {
    return this.claimRepo.find({
      where: { policyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findClaimById(id: string): Promise<ProtectionClaim> {
    const claim = await this.claimRepo.findOne({ where: { id } });
    if (!claim) throw new NotFoundException(`Claim ${id} not found`);
    return claim;
  }

  async reviewClaim(claimId: string, dto: ReviewClaimDto): Promise<ProtectionClaim> {
    const claim = await this.findClaimById(claimId);
    
    if (claim.status !== 'filed' && claim.status !== 'under_review') {
      throw new BadRequestException('Can only review filed or under-review claims');
    }

    const policy = await this.findPolicyById(claim.policyId);
    
    claim.reviewedAt = new Date();
    claim.reviewedBy = dto.reviewedBy;
    claim.reviewNotes = dto.reviewNotes;

    if (dto.approvedAmount !== undefined && dto.approvedAmount > 0) {
      claim.approvedAmount = dto.approvedAmount;
      claim.resolution = dto.approvedAmount >= Number(claim.claimedAmount) 
        ? ClaimResolution.APPROVED 
        : ClaimResolution.PARTIALLY_APPROVED;
      claim.status = 'approved';

      policy.totalClaimsPaid = Number(policy.totalClaimsPaid) + dto.approvedAmount;
      await this.policyRepo.save(policy);
    } else {
      claim.resolution = ClaimResolution.DENIED;
      claim.status = 'denied';
    }

    claim.resolvedAt = new Date();
    return this.claimRepo.save(claim);
  }

  async payClaim(claimId: string): Promise<ProtectionClaim> {
    const claim = await this.findClaimById(claimId);
    
    if (claim.status !== 'approved') {
      throw new BadRequestException('Only approved claims can be paid');
    }

    claim.status = 'paid';
    return this.claimRepo.save(claim);
  }

  async getStats(merchantId?: string): Promise<{
    totalPolicies: number;
    activePolicies: number;
    totalCoverage: number;
    totalClaims: number;
    totalClaimsPaid: number;
    pendingClaims: number;
  }> {
    const where: any = { deletedAt: IsNull() };
    if (merchantId) where.merchantId = merchantId;

    const policies = await this.policyRepo.find({ where });
    const policyIds = policies.map(p => p.id);
    
    let totalClaims = 0;
    let pendingClaims = 0;
    let totalClaimsPaid = 0;

    if (policyIds.length > 0) {
      const claims = await this.claimRepo.find({ where: { policyId: In(policyIds) } });
      totalClaims = claims.length;
      pendingClaims = claims.filter(c => c.status === 'filed' || c.status === 'under_review').length;
      totalClaimsPaid = claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + Number(c.approvedAmount), 0);
    }

    return {
      totalPolicies: policies.length,
      activePolicies: policies.filter(p => p.status === PolicyStatus.ACTIVE).length,
      totalCoverage: policies.reduce((sum, p) => sum + Number(p.coverageAmount), 0),
      totalClaims,
      totalClaimsPaid,
      pendingClaims,
    };
  }
}
