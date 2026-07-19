import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Load } from '../entities/load.entity';
import { LoadStatus } from '../enums/load-status.enum';

@Injectable()
export class LoadService {
  private readonly logger = new Logger(LoadService.name);

  constructor(
    @InjectRepository(Load)
    private readonly loadRepo: Repository<Load>,
  ) {}

  async findAll(): Promise<Load[]> {
    return this.loadRepo.find({ where: { deletedAt: IsNull() }, relations: {'hauler'}, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Load> {
    const load = await this.loadRepo.findOne({ 
      where: { id, deletedAt: IsNull() },
      relations: {'hauler'}
    });
    if (!load) throw new NotFoundException(`Load with ID ${id} not found`);
    return load;
  }

  async findByHaulerId(haulerId: string): Promise<Load[]> {
    return this.loadRepo.find({ 
      where: { haulerId, deletedAt: IsNull() },
      relations: {'hauler'},
      order: { createdAt: 'DESC' }
    });
  }

  async create(data: Partial<Load>): Promise<Load> {
    if (!data.loadNumber) {
      throw new BadRequestException('loadNumber is required');
    }
    const load = this.loadRepo.create(data);
    return this.loadRepo.save(load);
  }

  async update(id: string, data: Partial<Load>): Promise<Load> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.loadRepo.update(id, data);
    return this.findById(id);
  }

  async markPickupPending(id: string): Promise<Load> {
    const load = await this.findById(id);
    load.status = LoadStatus.PICKUP_PENDING;
    return this.loadRepo.save(load);
  }

  async markInTransit(id: string): Promise<Load> {
    const load = await this.findById(id);
    load.status = LoadStatus.IN_TRANSIT;
    load.pickedUpAt = new Date();
    return this.loadRepo.save(load);
  }

  async markDelivered(id: string): Promise<Load> {
    const load = await this.findById(id);
    load.status = LoadStatus.DELIVERED;
    load.deliveredAt = new Date();
    return this.loadRepo.save(load);
  }

  async cancel(id: string): Promise<Load> {
    const load = await this.findById(id);
    load.status = LoadStatus.CANCELLED;
    return this.loadRepo.save(load);
  }
}
