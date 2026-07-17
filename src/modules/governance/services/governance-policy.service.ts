import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernancePolicy } from '../entities/governance-policy.entity';

@Injectable()
export class GovernancePolicyService {
  constructor(
    @InjectRepository(GovernancePolicy)
    private readonly policyRepo: Repository<GovernancePolicy>,
  ) {}

  async findAll(type?: string, isActive?: boolean): Promise<GovernancePolicy[]> {
    const where: any = {};
    if (type) where.type = type as any;
    if (isActive !== undefined) where.isActive = isActive;
    return this.policyRepo.find({ where });
  }

  async findOne(id: string): Promise<GovernancePolicy | null> {
    return this.policyRepo.findOneBy({ id });
  }

  async create(data: Partial<GovernancePolicy>): Promise<GovernancePolicy> {
    const entity = this.policyRepo.create(data);
    return this.policyRepo.save(entity);
  }

  async update(id: string, data: Partial<GovernancePolicy>): Promise<GovernancePolicy | null> {
    await this.policyRepo.update(id, data);
    return this.policyRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.policyRepo.delete(id);
  }
}
