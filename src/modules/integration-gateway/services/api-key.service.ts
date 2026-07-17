import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepo: Repository<ApiKey>,
  ) {}

  async findAll(userId?: string): Promise<ApiKey[]> {
    return this.apiKeyRepo.find({ where: userId ? { userId } as any : {} });
  }

  async findOne(id: string): Promise<ApiKey | null> {
    return this.apiKeyRepo.findOneBy({ id });
  }

  async create(data: Partial<ApiKey>): Promise<ApiKey> {
    const entity = this.apiKeyRepo.create(data);
    return this.apiKeyRepo.save(entity);
  }

  async update(id: string, data: Partial<ApiKey>): Promise<ApiKey | null> {
    await this.apiKeyRepo.update(id, data);
    return this.apiKeyRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.apiKeyRepo.delete(id);
  }

  async deactivate(id: string): Promise<void> {
    await this.apiKeyRepo.update(id, { isActive: false });
  }
}
