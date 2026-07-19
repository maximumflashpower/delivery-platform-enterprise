import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Carrier } from '../entities/carrier.entity';
import { CarrierStatus } from '../enums/carrier-status.enum';

@Injectable()
export class CarrierService {
  private readonly logger = new Logger(CarrierService.name);

  constructor(
    @InjectRepository(Carrier)
    private readonly carrierRepo: Repository<Carrier>,
  ) {}

  async findAll(): Promise<Array<{ id: string; carrierCode: string; companyName: string; status: string }>> {
    const carriers = await this.carrierRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
    return carriers.map(c => ({ id: c.id, carrierCode: c.carrierCode, companyName: c.companyName, status: c.status }));
  }

  async findById(id: string): Promise<Carrier> {
    const carrier = await this.carrierRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: {'shipments'} });
    if (!carrier) throw new NotFoundException(`Carrier with ID ${id} not found`);
    return carrier;
  }

  async create(data: Partial<Carrier>): Promise<Carrier> {
    if (!data.carrierCode || !data.companyName) throw new BadRequestException('carrierCode and companyName are required');
    const existing = await this.carrierRepo.findOne({ where: { carrierCode: data.carrierCode } });
    if (existing && existing.deletedAt === null) throw new BadRequestException(`Carrier code ${data.carrierCode} already exists`);
    return this.carrierRepo.save(this.carrierRepo.create(data));
  }

  async update(id: string, data: Partial<Carrier>): Promise<Carrier> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.carrierRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> { await this.findById(id); await this.carrierRepo.softDelete(id); }

  async activate(id: string): Promise<Carrier> { const c = await this.findById(id); c.status = CarrierStatus.ACTIVE; return this.carrierRepo.save(c); }
  async suspend(id: string): Promise<Carrier> { const c = await this.findById(id); c.status = CarrierStatus.SUSPENDED; return this.carrierRepo.save(c); }
  async verify(id: string): Promise<Carrier> { const c = await this.findById(id); c.status = CarrierStatus.ACTIVE; return this.carrierRepo.save(c); }
}
