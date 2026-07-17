import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { MerchantContract } from '../entities/merchant-contract.entity';
import { ContractStatus } from '../enums/contract-status.enum';

@Injectable()
export class MerchantContractService {
  private readonly logger = new Logger(MerchantContractService.name);

  constructor(
    @InjectRepository(MerchantContract)
    private readonly contractRepo: Repository<MerchantContract>,
  ) {}

  async findAll(): Promise<MerchantContract[]> {
    return this.contractRepo.find({ where: { deletedAt: IsNull() }, relations: ['merchant'] });
  }

  async findByMerchantId(merchantId: string): Promise<MerchantContract[]> {
    return this.contractRepo.find({ 
      where: { merchantId, deletedAt: IsNull() }, 
      relations: ['merchant'],
      order: { endDate: 'DESC' } 
    });
  }

  async findById(id: string): Promise<MerchantContract> {
    const contract = await this.contractRepo.findOne({ 
      where: { id, deletedAt: IsNull() }, 
      relations: ['merchant'] 
    });
    if (!contract) throw new NotFoundException(`Contract with ID ${id} not found`);
    return contract;
  }

  async create(data: Partial<MerchantContract>): Promise<MerchantContract> {
    const contract = this.contractRepo.create(data);
    return this.contractRepo.save(contract);
  }

  async activate(id: string): Promise<MerchantContract> {
    const contract = await this.findById(id);
    contract.status = ContractStatus.ACTIVE;
    return this.contractRepo.save(contract);
  }

  async terminate(id: string, reason?: string): Promise<MerchantContract> {
    const contract = await this.findById(id);
    contract.status = ContractStatus.TERMINATED;
    return this.contractRepo.save(contract);
  }

  async renew(id: string, newEndDate: Date): Promise<MerchantContract> {
    const contract = await this.findById(id);
    contract.endDate = newEndDate;
    contract.status = ContractStatus.ACTIVE;
    return this.contractRepo.save(contract);
  }
}
