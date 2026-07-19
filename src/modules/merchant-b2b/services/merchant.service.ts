import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Merchant } from '../entities/merchant.entity';
import { MerchantStatus } from '../enums/merchant-status.enum';
import { TierLevel } from '../enums/tier-level.enum';

@Injectable()
export class MerchantService {
  private readonly logger = new Logger(MerchantService.name);

  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepo: Repository<Merchant>,
  ) {}

  async findAll(): Promise<Array<{ id: string; merchantCode: string; legalName: string; status: string; tier: string }>> {
    const merchants = await this.merchantRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
    return merchants.map(m => ({
      id: m.id,
      merchantCode: m.merchantCode,
      legalName: m.legalName,
      status: m.status,
      tier: m.tier,
    }));
  }

  async findById(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: {'contracts', 'invoices'} });
    if (!merchant) throw new NotFoundException(`Merchant with ID ${id} not found`);
    return merchant;
  }

  async findByOwnerId(ownerId: string): Promise<Merchant[]> {
    return this.merchantRepo.find({ where: { ownerId, deletedAt: IsNull() } });
  }

  async create(data: Partial<Merchant>): Promise<Merchant> {
    if (!data.merchantCode || !data.legalName || !data.tradeName) {
      throw new BadRequestException('merchantCode, legalName, and tradeName are required');
    }
    const existing = await this.merchantRepo.findOne({ where: { merchantCode: data.merchantCode } });
    if (existing && !existing.deletedAt) {
      throw new BadRequestException(`Merchant code ${data.merchantCode} already exists`);
    }
    const merchant = this.merchantRepo.create(data);
    return this.merchantRepo.save(merchant);
  }

  async update(id: string, data: Partial<Merchant>): Promise<Merchant> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.merchantRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const merchant = await this.findById(id);
    await this.merchantRepo.softDelete(id);
  }

  async approve(id: string): Promise<Merchant> {
    const merchant = await this.findById(id);
    merchant.status = MerchantStatus.APPROVED;
    return this.merchantRepo.save(merchant);
  }

  async reject(id: string, reason?: string): Promise<Merchant> {
    const merchant = await this.findById(id);
    merchant.status = MerchantStatus.REJECTED;
    return this.merchantRepo.save(merchant);
  }

  async upgradeTier(id: string, tier: TierLevel): Promise<Merchant> {
    const merchant = await this.findById(id);
    merchant.tier = tier;
    return this.merchantRepo.save(merchant);
  }

  async getStats(): Promise<{ totalMerchants: number; approvedMerchants: number; averageCommissionRate: number }> {
    const totalResult = await this.merchantRepo.createQueryBuilder('m')
      .select('COUNT(DISTINCT m.id)', 'total')
      .where('m.deletedAt IS NULL')
      .getRawOne();
    const totalMerchants = parseInt(totalResult?.total || '0', 10);

    const approvedResult = await this.merchantRepo.createQueryBuilder('m')
      .select('COUNT(DISTINCT m.id)', 'approved')
      .where('m.deletedAt IS NULL')
      .andWhere('m.status = :status', { status: MerchantStatus.APPROVED })
      .getRawOne();
    const approvedMerchants = parseInt(approvedResult?.approved || '0', 10);

    const contractResult = await this.merchantRepo.createQueryBuilder('m')
      .leftJoin('m.contracts', 'c')
      .addSelect('AVG(c.commissionRate)', 'avg')
      .where('c.status = :contractStatus', { contractStatus: 'active' })
      .getRawOne();
    const averageCommissionRate = parseFloat(contractResult?.avg || '0');

    return { totalMerchants, approvedMerchants, averageCommissionRate };
  }
}
