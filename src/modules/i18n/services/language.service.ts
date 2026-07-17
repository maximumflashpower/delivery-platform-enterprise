import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../entities/language.entity';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepo: Repository<Language>,
  ) {}

  async findAll(isActive?: boolean): Promise<Language[]> {
    return this.languageRepo.find({ where: isActive !== undefined ? { isActive } : {} });
  }

  async findOne(id: string): Promise<Language | null> {
    return this.languageRepo.findOneBy({ id });
  }

  async create(data: Partial<Language>): Promise<Language> {
    const entity = this.languageRepo.create(data);
    return this.languageRepo.save(entity);
  }

  async update(id: string, data: Partial<Language>): Promise<Language | null> {
    await this.languageRepo.update(id, data);
    return this.languageRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.languageRepo.delete(id);
  }
}
