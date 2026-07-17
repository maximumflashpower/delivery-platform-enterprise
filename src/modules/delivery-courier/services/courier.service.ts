import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Courier } from '../entities/courier.entity';
import { CourierAssignment } from '../entities/courier-assignment.entity';
import { DeliveryBatch } from '../entities/delivery-batch.entity';
import { CourierStatus } from '../enums/courier-status.enum';

@Injectable()
export class CourierService {
  private readonly logger = new Logger(CourierService.name);

  constructor(
    @InjectRepository(Courier)
    private readonly courierRepo: Repository<Courier>,
    @InjectRepository(CourierAssignment)
    private readonly assignmentRepo: Repository<CourierAssignment>,
    @InjectRepository(DeliveryBatch)
    private readonly batchRepo: Repository<DeliveryBatch>,
  ) {}

  async findAll(): Promise<Array<{ id: string; courierCode: string; status: string; rating: number }>> {
    const couriers = await this.courierRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
    return couriers.map(c => ({
      id: c.id,
      courierCode: c.courierCode,
      status: c.status,
      rating: Number(c.rating),
    }));
  }

  async findById(id: string): Promise<Courier> {
    const courier = await this.courierRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!courier) throw new NotFoundException(`Courier with ID ${id} not found`);
    return courier;
  }

  async findByUserId(userId: string): Promise<Courier[]> {
    return this.courierRepo.find({ where: { userId, deletedAt: IsNull() } });
  }

  async create(data: Partial<Courier>): Promise<Courier> {
    if (!data.courierCode) {
      throw new BadRequestException('courierCode and displayName are required');
    }
    const existing = await this.courierRepo.findOne({ where: { courierCode: data.courierCode } });
    if (existing && !existing.deletedAt) {
      throw new BadRequestException(`Courier code ${data.courierCode} already exists`);
    }
    const courier = this.courierRepo.create(data);
    return this.courierRepo.save(courier);
  }

  async update(id: string, data: Partial<Courier>): Promise<Courier> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.courierRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const courier = await this.findById(id);
    await this.courierRepo.softDelete(id);
  }

  async activate(id: string): Promise<Courier> {
    const courier = await this.findById(id);
    courier.status = CourierStatus.ACTIVE;
    courier.isAvailable = true;
    return this.courierRepo.save(courier);
  }

  async deactivate(id: string, reason?: string): Promise<Courier> {
    const courier = await this.findById(id);
    courier.status = CourierStatus.INACTIVE;
    courier.isAvailable = false;
    return this.courierRepo.save(courier);
  }

  async getStats(): Promise<{ totalActive: number; totalAvailable: number; averageRating: number }> {
    const countResult = await this.courierRepo.createQueryBuilder('c')
      .select('COUNT(DISTINCT c.id)', 'total')
      .where('c.deletedAt IS NULL')
      .getRawOne();
    const total = parseInt(countResult?.total || '0', 10);

    const activeResult = await this.courierRepo.createQueryBuilder('c')
      .select('COUNT(DISTINCT c.id)', 'active')
      .where('c.deletedAt IS NULL')
      .andWhere('c.status = :status', { status: CourierStatus.ACTIVE })
      .getRawOne();
    const totalActive = parseInt(activeResult?.active || '0', 10);

    const availResult = await this.courierRepo.createQueryBuilder('c')
      .select('AVG(c.rating)', 'avg')
      .where('c.deletedAt IS NULL')
      .andWhere('c.isAvailable = true')
      .getRawOne();
    const avgRating = parseFloat(availResult?.avg || '0');

    return { totalActive, totalAvailable: totalActive, averageRating: avgRating };
  }
}
