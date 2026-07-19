import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { MovingRequest } from '../entities/moving-request.entity';
import { RequestStatus } from '../enums/request-status.enum';

@Injectable()
export class MovingRequestService {
  private readonly logger = new Logger(MovingRequestService.name);

  constructor(
    @InjectRepository(MovingRequest)
    private readonly requestRepo: Repository<MovingRequest>,
  ) {}

  async findAll(): Promise<MovingRequest[]> {
    return this.requestRepo.find({ 
      where: { deletedAt: IsNull() }, 
      relations: {'customer', 'hauler'},
      order: { createdAt: 'DESC' } 
    });
  }

  async findById(id: string): Promise<MovingRequest> {
    const request = await this.requestRepo.findOne({ 
      where: { id, deletedAt: IsNull() },
      relations: {'customer', 'hauler'}
    });
    if (!request) throw new NotFoundException(`Request with ID ${id} not found`);
    return request;
  }

  async findByCustomerId(customerId: string): Promise<MovingRequest[]> {
    return this.requestRepo.find({ 
      where: { customerId, deletedAt: IsNull() },
      relations: {'hauler'},
      order: { createdAt: 'DESC' }
    });
  }

  async create(data: Partial<MovingRequest>): Promise<MovingRequest> {
    if (!data.requestCode) {
      throw new BadRequestException('requestCode is required');
    }
    const request = this.requestRepo.create(data);
    return this.requestRepo.save(request);
  }

  async update(id: string, data: Partial<MovingRequest>): Promise<MovingRequest> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.requestRepo.update(id, data);
    return this.findById(id);
  }

  async assignHauler(id: string, haulerId: string): Promise<MovingRequest> {
    const request = await this.findById(id);
    request.haulerId = haulerId;
    return this.requestRepo.save(request);
  }

  async acceptQuote(id: string): Promise<MovingRequest> {
    const request = await this.findById(id);
    request.status = RequestStatus.BOOKED;
    return this.requestRepo.save(request);
  }

  async cancel(id: string): Promise<MovingRequest> {
    const request = await this.findById(id);
    request.status = RequestStatus.CANCELLED;
    return this.requestRepo.save(request);
  }

  async complete(id: string): Promise<MovingRequest> {
    const request = await this.findById(id);
    request.status = RequestStatus.COMPLETED;
    return this.requestRepo.save(request);
  }
}
