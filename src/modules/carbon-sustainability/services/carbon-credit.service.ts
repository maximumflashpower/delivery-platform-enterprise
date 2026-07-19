import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarbonCredit } from '../entities/carbon-credit.entity';

@Injectable()
export class CarbonCreditService {
  constructor(
    @InjectRepository(CarbonCredit)
    private readonly creditRepo: Repository<CarbonCredit>,
  ) {}

  async findAll(isActive?: boolean): Promise<CarbonCredit[]> {
    return this.creditRepo.find({ where: isActive !== undefined ? { isActive } as any : {} });
  }

  async findOne(id: string): Promise<CarbonCredit | null> {
    return this.creditRepo.findOneBy({ id });
  }

  async create(data: Partial<CarbonCredit>): Promise<CarbonCredit> {
    const entity = this.creditRepo.create(data);
    return this.creditRepo.save(entity);
  }

  async update(id: string, data: Partial<CarbonCredit>): Promise<CarbonCredit | null> {
    await this.creditRepo.update(id, data);
    return this.creditRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.creditRepo.delete(id);
  }
}
