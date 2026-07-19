import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartContract } from '../entities/smart-contract.entity';

@Injectable()
export class SmartContractService {
  constructor(
    @InjectRepository(SmartContract)
    private readonly contractRepo: Repository<SmartContract>,
  ) {}

  async findAll(status?: string): Promise<SmartContract[]> {
    return this.contractRepo.find({ where: status ? { status } as any : {} });
  }

  async findOne(id: string): Promise<SmartContract | null> {
    return this.contractRepo.findOneBy({ id });
  }

  async create(data: Partial<SmartContract>): Promise<SmartContract> {
    const entity = this.contractRepo.create(data);
    return this.contractRepo.save(entity);
  }

  async update(id: string, data: Partial<SmartContract>): Promise<SmartContract | null> {
    await this.contractRepo.update(id, data);
    return this.contractRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.contractRepo.delete(id);
  }
}
