import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Shipment } from '../entities/shipment.entity';
import { ShipmentStatus } from '../enums/shipment-status.enum';

@Injectable()
export class ShipmentService {
  private readonly logger = new Logger(ShipmentService.name);

  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,
  ) {}

  async findAll(): Promise<Shipment[]> {
    return this.shipmentRepo.find({ where: { deletedAt: IsNull() }, relations: ['carrier'], order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Shipment> {
    const s = await this.shipmentRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: ['carrier'] });
    if (!s) throw new NotFoundException(`Shipment with ID ${id} not found`);
    return s;
  }

  async findByCarrierId(carrierId: string): Promise<Shipment[]> {
    return this.shipmentRepo.find({ where: { carrierId, deletedAt: IsNull() }, relations: ['carrier'], order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<Shipment>): Promise<Shipment> {
    if (!data.shipmentNumber) throw new BadRequestException('shipmentNumber is required');
    return this.shipmentRepo.save(this.shipmentRepo.create(data));
  }

  async update(id: string, data: Partial<Shipment>): Promise<Shipment> {
    await this.findById(id); Object.assign(data, { updatedAt: new Date() }); await this.shipmentRepo.update(id, data); return this.findById(id);
  }

  async markPickedUp(id: string): Promise<Shipment> { const s = await this.findById(id); s.status = ShipmentStatus.PICKED_UP; return this.shipmentRepo.save(s); }
  async markInTransit(id: string): Promise<Shipment> { const s = await this.findById(id); s.status = ShipmentStatus.IN_TRANSIT; return this.shipmentRepo.save(s); }
  async markOutForDelivery(id: string): Promise<Shipment> { const s = await this.findById(id); s.status = ShipmentStatus.OUT_FOR_DELIVERY; return this.shipmentRepo.save(s); }
  async markDelivered(id: string): Promise<Shipment> { const s = await this.findById(id); s.status = ShipmentStatus.DELIVERED; s.deliveryDateTime = new Date(); return this.shipmentRepo.save(s); }
  async cancel(id: string): Promise<Shipment> { const s = await this.findById(id); s.status = ShipmentStatus.CANCELLED; return this.shipmentRepo.save(s); }
  async markReturned(id: string): Promise<Shipment> { const s = await this.findById(id); s.status = ShipmentStatus.RETURNED; return this.shipmentRepo.save(s); }
}
