import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDataRequest, RequestStatus, RequestType } from '../entities/user-data-request.entity';

@Injectable()
export class UserDataRequestService {
  constructor(
    @InjectRepository(UserDataRequest)
    private readonly repo: Repository<UserDataRequest>,
  ) {}

  async submit(userId: string, type: RequestType, details?: string): Promise<UserDataRequest> {
    const request = this.repo.create({
      userId,
      request_type: type,
      status: RequestStatus.SUBMITTED,
      additional_details: details,
      submitted_at: new Date()
    });

    return this.repo.save(request);
  }

  async findAllByUser(userId: string): Promise<UserDataRequest[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<UserDataRequest> {
    const request = await this.repo.findOne({ where: { id } });
    if (!request) throw new NotFoundException(`Request ${id} not found`);
    return request;
  }

  async startProcessing(id: string): Promise<UserDataRequest> {
    const request = await this.findOne(id);
    request.status = RequestStatus.IN_PROGRESS;
    return this.repo.save(request);
  }

  async complete(id: string, processedBy: string, deliveryUrl?: string): Promise<UserDataRequest> {
    const request = await this.findOne(id);
    request.status = RequestStatus.COMPLETED;
    request.processed_at = new Date();
    request.completed_at = new Date();
    request.processed_by = processedBy;
    if (deliveryUrl) request.delivery_url = deliveryUrl;
    return this.repo.save(request);
  }

  async reject(id: string, processedBy: string, reason: string): Promise<UserDataRequest> {
    const request = await this.findOne(id);
    request.status = RequestStatus.REJECTED;
    request.rejection_reason = reason;
    request.processed_at = new Date();
    request.processed_by = processedBy;
    return this.repo.save(request);
  }
}
