import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateLimitPolicy } from '../entities/rate-limit-policy.entity';

@Injectable()
export class RateLimitPolicyService {
  constructor(
    @InjectRepository(RateLimitPolicy)
    private readonly policyRepo: Repository<RateLimitPolicy>,
  ) {}

  async findAll(isActive?: boolean): Promise<RateLimitPolicy[]> {
    return this.policyRepo.find({ where: isActive !== undefined ? { isActive } : {} });
  }

  async findOne(id: string): Promise<RateLimitPolicy | null> {
    return this.policyRepo.findOneBy({ id });
  }

  async create(data: Partial<RateLimitPolicy>): Promise<RateLimitPolicy> {
    const entity = this.policyRepo.create(data);
    return this.policyRepo.save(entity);
  }

  async update(id: string, data: Partial<RateLimitPolicy>): Promise<RateLimitPolicy | null> {
    await this.policyRepo.update(id, data);
    return this.policyRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.policyRepo.delete(id);
  }
}
