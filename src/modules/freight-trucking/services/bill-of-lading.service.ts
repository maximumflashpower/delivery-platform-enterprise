import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { BillOfLading } from '../entities/bill-of-lading.entity';

@Injectable()
export class BillOfLadingService {
  private readonly logger = new Logger(BillOfLadingService.name);

  constructor(
    @InjectRepository(BillOfLading)
    private readonly bolRepo: Repository<BillOfLading>,
  ) {}

  async findAll(): Promise<BillOfLading[]> {
    return this.bolRepo.find({ where: { deletedAt: IsNull() }, relations: {'shipment'}, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<BillOfLading> {
    const b = await this.bolRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: {'shipment'} });
    if (!b) throw new NotFoundException(`Bill of Lading with ID ${id} not found`);
    return b;
  }

  async findByShipmentId(shipmentId: string): Promise<BillOfLading[]> {
    return this.bolRepo.find({ where: { shipmentId, deletedAt: IsNull() }, relations: {'shipment'}, order: { issueDate: 'DESC' } });
  }

  async create(data: Partial<BillOfLading>): Promise<BillOfLading> {
    if (!data.bolNumber || !data.shipmentId) throw new BadRequestException('bolNumber and shipmentId are required');
    return this.bolRepo.save(this.bolRepo.create(data));
  }

  async update(id: string, data: Partial<BillOfLading>): Promise<BillOfLading> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.bolRepo.update(id, data);
    return this.findById(id);
  }

  async sign(id: string, signerName: string): Promise<BillOfLading> {
    const b = await this.findById(id);
    b.isSigned = true;
    b.signedAt = new Date();
    b.signerName = signerName;
    return this.bolRepo.save(b);
  }
}
