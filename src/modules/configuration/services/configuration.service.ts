import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from '../entities/configuration.entity';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configRepo: Repository<Configuration>,
  ) {}

  async findAll(scope?: string): Promise<Configuration[]> {
    return this.configRepo.find({ where: scope ? { scope: scope as any } : {} });
  }

  async findOne(id: string): Promise<Configuration | null> {
    return this.configRepo.findOneBy({ id });
  }

  async create(data: Partial<Configuration>): Promise<Configuration> {
    const entity = this.configRepo.create(data);
    return this.configRepo.save(entity);
  }

  async update(id: string, data: Partial<Configuration>): Promise<Configuration | null> {
    await this.configRepo.update(id, data);
    return this.configRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.configRepo.delete(id);
  }
}
