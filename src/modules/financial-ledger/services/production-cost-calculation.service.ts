import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, IsNull } from 'typeorm';
import { ProductionCostCalculation, CostCalculationStatus, CostCategory } from '../entities/production-cost-calculation.entity';
import { CostLineItem } from '../entities/cost-line-item.entity';
import { CreateProductionCostCalculationDto, CreateCostLineItemDto, CalculateTotalsDto, ReviewCalculationDto, ApproveCalculationDto } from '../dto/production-cost-calculation.dto';

@Injectable()
export class ProductionCostCalculationService {
  private readonly logger = new Logger(ProductionCostCalculationService.name);

  constructor(
    @InjectRepository(ProductionCostCalculation)
    private readonly calcRepo: Repository<ProductionCostCalculation>,
    @InjectRepository(CostLineItem)
    private readonly lineItemRepo: Repository<CostLineItem>,
  ) {}

  async create(dto: CreateProductionCostCalculationDto): Promise<ProductionCostCalculation> {
    const calculation = this.calcRepo.create({
      ...dto,
      grandTotal: 0,
      costPerUnit: 0,
      status: dto.status || CostCalculationStatus.DRAFT,
    });
    return this.calcRepo.save(calculation);
  }

  async findById(id: string): Promise<ProductionCostCalculation> {
    const calc = await this.calcRepo.findOne({ where: { id } });
    if (!calc) throw new NotFoundException(`Calculation ${id} not found`);
    return calc;
  }

  async findByMerchant(merchantId: string, page = 1, limit = 20): Promise<{ total: number; items: ProductionCostCalculation[] }> {
    const [items, total] = await this.calcRepo.findAndCount({
      where: { merchantId, deletedAt: IsNull() } as any,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { total, items };
  }

  async search(searchTerm: string, merchantId?: string): Promise<ProductionCostCalculation[]> {
    const qb = this.calcRepo.createQueryBuilder('calc').where('calc.deletedAt IS NULL');
    
    if (searchTerm) {
      qb.andWhere('(calc.productName LIKE :term OR calc.productDescription LIKE :term)', { term: `%${searchTerm}%` });
    }
    
    if (merchantId) {
      qb.andWhere('calc.merchantId = :merchantId', { merchantId });
    }

    return qb.orderBy('calc.createdAt', 'DESC').getMany();
  }

  async addItem(calcId: string, dto: CreateCostLineItemDto): Promise<CostLineItem> {
    const calc = await this.findById(calcId);
    
    const lineItem = this.lineItemRepo.create({
      ...dto,
      calculationId: calcId,
    });
    
    await this.lineItemRepo.save(lineItem);
    await this.recalculateTotals(calcId);
    
    return lineItem;
  }

  async getLineItems(calcId: string): Promise<CostLineItem[]> {
    const items = await this.lineItemRepo.find({
      where: { calculationId: calcId },
      order: { createdAt: 'ASC' },
    });
    return items;
  }

  async recalculateTotals(calcId: string): Promise<ProductionCostCalculation> {
    const calc = await this.findById(calcId);
    const items = await this.getLineItems(calcId);

    const materials = items.filter(i => i.category === CostCategory.MATERIALS);
    const labor = items.filter(i => i.category === CostCategory.LABOR);
    const logistics = items.filter(i => i.category === CostCategory.LOGISTICS);
    const packaging = items.filter(i => i.category === CostCategory.PACKAGING);
    const overhead = items.filter(i => i.category === CostCategory.OVERHEAD);
    const marketing = items.filter(i => i.category === CostCategory.MARKETING);
    const fees = items.filter(i => i.category === CostCategory.FEES);
    const taxes = items.filter(i => i.category === CostCategory.TAXES);

    const sum = (arr: CostLineItem[]) => arr.reduce((acc, item) => acc + Number(item.totalWithDiscountAndTax), 0);

    calc.totalDirectMaterials = sum(materials);
    calc.totalDirectLabor = sum(labor);
    calc.totalLogistics = sum(logistics);
    calc.totalPackaging = sum(packaging);
    calc.totalOverhead = sum(overhead);
    calc.totalMarketing = sum(marketing);
    calc.totalFees = sum(fees);
    calc.totalTaxes = sum(taxes);

    calc.grandTotal = sum(items);
    calc.costPerUnit = calc.productionQuantity > 0 ? calc.grandTotal / calc.productionQuantity : 0;

    calc.calculatedAt = new Date();
    const saved = await this.calcRepo.save(calc);
    
    this.logger.log(`Recalculated totals for calculation ${calcId}: ${saved.grandTotal} ${saved.currency}`);
    return saved;
  }

  async review(calcId: string, dto: ReviewCalculationDto): Promise<ProductionCostCalculation> {
    const calc = await this.findById(calcId);
    if (![CostCalculationStatus.COMPLETED].includes(calc.status)) {
      throw new BadRequestException('Can only review completed calculations');
    }
    
    calc.status = CostCalculationStatus.REVIEWED;
    calc.reviewNotes = dto.reviewNotes;
    calc.reviewedBy = dto.reviewedBy;
    calc.reviewedAt = new Date();
    
    return this.calcRepo.save(calc);
  }

  async approve(calcId: string, dto: ApproveCalculationDto): Promise<ProductionCostCalculation> {
    const calc = await this.findById(calcId);
    if (![CostCalculationStatus.REVIEWED, CostCalculationStatus.COMPLETED].includes(calc.status)) {
      throw new BadRequestException('Only reviewed or completed calculations can be approved');
    }
    
    calc.status = CostCalculationStatus.APPROVED;
    calc.approvedBy = dto.approvedBy;
    calc.approvedAt = new Date();
    calc.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    return this.calcRepo.save(calc);
  }

  async updateStatus(calcId: string, status: CostCalculationStatus): Promise<ProductionCostCalculation> {
    const calc = await this.findById(calcId);
    calc.status = status;
    return this.calcRepo.save(calc);
  }

  async delete(calcId: string): Promise<void> {
    const calc = await this.findById(calcId);
    calc.deletedAt = new Date();
    await this.calcRepo.save(calc);
  }

  async getStats(merchantId?: string): Promise<{
    totalCalculations: number;
    byStatus: Record<string, number>;
    avgCostPerUnit: number;
    totalCalculatedValue: number;
  }> {
    const where: any = { deletedAt: IsNull() };
    if (merchantId) where.merchantId = merchantId;

    const calculations = await this.calcRepo.find({ where });
    
    const byStatus: Record<string, number> = {};
    let totalCost = 0;
    let totalUnits = 0;

    calculations.forEach(calc => {
      byStatus[calc.status] = (byStatus[calc.status] || 0) + 1;
      totalCost += calc.grandTotal;
      totalUnits += calc.productionQuantity;
    });

    return {
      totalCalculations: calculations.length,
      byStatus,
      avgCostPerUnit: totalUnits > 0 ? totalCost / totalUnits : 0,
      totalCalculatedValue: totalCost,
    };
  }
}
