import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelVersion } from '../entities/model-version.entity';

@Injectable()
export class ModelVersionService {
  constructor(
    @InjectRepository(ModelVersion)
    private readonly modelRepo: Repository<ModelVersion>,
  ) {}

  async findAll(status?: string): Promise<ModelVersion[]> {
    return this.modelRepo.find({ where: status ? { status } as any : {} });
  }

  async findOne(id: string): Promise<ModelVersion | null> {
    return this.modelRepo.findOneBy({ id });
  }

  async create(data: Partial<ModelVersion>): Promise<ModelVersion> {
    const entity = this.modelRepo.create(data);
    return this.modelRepo.save(entity);
  }

  async update(id: string, data: Partial<ModelVersion>): Promise<ModelVersion | null> {
    await this.modelRepo.update(id, data);
    return this.modelRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.modelRepo.delete(id);
  }
}
