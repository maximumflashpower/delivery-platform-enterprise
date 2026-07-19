import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Hauler } from '../entities/hauler.entity';
import { HaulerStatus } from '../enums/hauler-status.enum';

@Injectable()
export class HaulerService {
  private readonly logger = new Logger(HaulerService.name);

  constructor(
    @InjectRepository(Hauler)
    private readonly haulerRepo: Repository<Hauler>,
  ) {}

  async findAll(): Promise<Array<{ id: string; haulerCode: string; status: string; rating: number }>> {
    const haulers = await this.haulerRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
    return haulers.map(h => ({
      id: h.id,
      haulerCode: h.haulerCode,
      status: h.status,
      rating: Number(h.rating),
    }));
  }

  async findById(id: string): Promise<Hauler> {
    const hauler = await this.haulerRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: {'loads', 'requests'} });
    if (!hauler) throw new NotFoundException(`Hauler with ID ${id} not found`);
    return hauler;
  }

  async findByUserId(userId: string): Promise<Hauler[]> {
    return this.haulerRepo.find({ where: { userId, deletedAt: IsNull() } });
  }

  async create(data: Partial<Hauler>): Promise<Hauler> {
    if (!data.haulerCode || !data.companyName) {
      throw new BadRequestException('haulerCode and companyName are required');
    }
    const existing = await this.haulerRepo.findOne({ where: { haulerCode: data.haulerCode } });
    if (existing && existing.deletedAt === null) {
      throw new BadRequestException(`Hauler code ${data.haulerCode} already exists`);
    }
    const hauler = this.haulerRepo.create(data);
    return this.haulerRepo.save(hauler);
  }

  async update(id: string, data: Partial<Hauler>): Promise<Hauler> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.haulerRepo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const hauler = await this.findById(id);
    await this.haulerRepo.softDelete(id);
  }

  async activate(id: string): Promise<Hauler> {
    const hauler = await this.findById(id);
    hauler.status = HaulerStatus.ACTIVE;
    return this.haulerRepo.save(hauler);
  }

  async deactivate(id: string): Promise<Hauler> {
    const hauler = await this.findById(id);
    hauler.status = HaulerStatus.INACTIVE;
    return this.haulerRepo.save(hauler);
  }
}
