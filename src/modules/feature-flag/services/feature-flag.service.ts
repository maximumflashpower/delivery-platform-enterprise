import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureFlag } from '../entities/feature-flag.entity';

@Injectable()
export class FeatureFlagService {
  constructor(
    @InjectRepository(FeatureFlag)
    private readonly flagRepo: Repository<FeatureFlag>,
  ) {}

  async findAll(environment?: string): Promise<FeatureFlag[]> {
    return this.flagRepo.find({ where: environment ? { environment } as any : {} });
  }

  async findOne(id: string): Promise<FeatureFlag | null> {
    return this.flagRepo.findOneBy({ id });
  }

  async create(data: Partial<FeatureFlag>): Promise<FeatureFlag> {
    const entity = this.flagRepo.create(data);
    return this.flagRepo.save(entity);
  }

  async update(id: string, data: Partial<FeatureFlag>): Promise<FeatureFlag | null> {
    await this.flagRepo.update(id, data);
    return this.flagRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.flagRepo.delete(id);
  }
}
