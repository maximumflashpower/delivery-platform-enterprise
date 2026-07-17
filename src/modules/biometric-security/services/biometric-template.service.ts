import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiometricTemplate } from '../entities/biometric-template.entity';

@Injectable()
export class BiometricTemplateService {
  constructor(
    @InjectRepository(BiometricTemplate)
    private readonly templateRepo: Repository<BiometricTemplate>,
  ) {}

  async findAll(userId?: string): Promise<BiometricTemplate[]> {
    return this.templateRepo.find({ where: userId ? { userId } as any : {} });
  }

  async findOne(id: string): Promise<BiometricTemplate | null> {
    return this.templateRepo.findOneBy({ id });
  }

  async create(data: Partial<BiometricTemplate>): Promise<BiometricTemplate> {
    const entity = this.templateRepo.create(data);
    return this.templateRepo.save(entity);
  }

  async update(id: string, data: Partial<BiometricTemplate>): Promise<BiometricTemplate | null> {
    await this.templateRepo.update(id, data);
    return this.templateRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.templateRepo.delete(id);
  }
}
