import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookEndpoint } from '../entities/webhook-endpoint.entity';

@Injectable()
export class WebhookEndpointService {
  constructor(
    @InjectRepository(WebhookEndpoint)
    private readonly endpointRepo: Repository<WebhookEndpoint>,
  ) {}

  async findAll(ownerUserId?: string): Promise<WebhookEndpoint[]> {
    return this.endpointRepo.find({ where: ownerUserId ? { ownerUserId } : {} });
  }

  async findOne(id: string): Promise<WebhookEndpoint | null> {
    return this.endpointRepo.findOneBy({ id });
  }

  async create(data: Partial<WebhookEndpoint>): Promise<WebhookEndpoint> {
    const entity = this.endpointRepo.create(data);
    return this.endpointRepo.save(entity);
  }

  async update(id: string, data: Partial<WebhookEndpoint>): Promise<WebhookEndpoint | null> {
    await this.endpointRepo.update(id, data);
    return this.endpointRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.endpointRepo.delete(id);
  }
}
