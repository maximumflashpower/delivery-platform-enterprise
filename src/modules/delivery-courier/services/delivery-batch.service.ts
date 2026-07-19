import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DeliveryBatch } from '../entities/delivery-batch.entity';
import { BatchStatus } from '../enums/batch-status.enum';

@Injectable()
export class DeliveryBatchService {
  private readonly logger = new Logger(DeliveryBatchService.name);

  constructor(
    @InjectRepository(DeliveryBatch)
    private readonly batchRepo: Repository<DeliveryBatch>,
  ) {}

  async findAll(): Promise<DeliveryBatch[]> {
    return this.batchRepo.find({ where: { deletedAt: IsNull() }, relations: {'courier'}, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<DeliveryBatch> {
    const batch = await this.batchRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: {'courier'} });
    if (!batch) throw new NotFoundException(`Batch with ID ${id} not found`);
    return batch;
  }

  async create(data: Partial<DeliveryBatch>): Promise<DeliveryBatch> {
    if (!data.batchNumber) {
      throw new BadRequestException('batchNumber is required');
    }
    const existing = await this.batchRepo.findOne({ where: { batchNumber: data.batchNumber } });
    if (existing && !existing.deletedAt) {
      throw new BadRequestException(`Batch number ${data.batchNumber} already exists`);
    }
    const batch = this.batchRepo.create(data);
    return this.batchRepo.save(batch);
  }

  async assignCourier(batchId: string, courierId: string): Promise<DeliveryBatch> {
    const batch = await this.findById(batchId);
    batch.courierId = courierId;
    return this.batchRepo.save(batch);
  }

  async startBatch(batchId: string): Promise<DeliveryBatch> {
    const batch = await this.findById(batchId);
    if (batch.status !== BatchStatus.PENDING) {
      throw new BadRequestException(`Cannot start batch with status ${batch.status}`);
    }
    batch.status = BatchStatus.IN_PROGRESS;
    return this.batchRepo.save(batch);
  }

  async completeBatch(batchId: string): Promise<DeliveryBatch> {
    const batch = await this.findById(batchId);
    batch.status = BatchStatus.COMPLETED;
    return this.batchRepo.save(batch);
  }

  async cancelBatch(batchId: string): Promise<DeliveryBatch> {
    const batch = await this.findById(batchId);
    batch.status = BatchStatus.CANCELLED;
    return this.batchRepo.save(batch);
  }
}
