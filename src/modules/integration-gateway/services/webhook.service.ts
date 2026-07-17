import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webhook } from '../entities/webhook.entity';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepo: Repository<Webhook>,
  ) {}

  async findAll(isActive?: boolean): Promise<Webhook[]> {
    return this.webhookRepo.find({ where: isActive !== undefined ? { isActive } as any : {} });
  }

  async findOne(id: string): Promise<Webhook | null> {
    return this.webhookRepo.findOneBy({ id });
  }

  async create(data: Partial<Webhook>): Promise<Webhook> {
    const entity = this.webhookRepo.create(data);
    return this.webhookRepo.save(entity);
  }

  async update(id: string, data: Partial<Webhook>): Promise<Webhook | null> {
    await this.webhookRepo.update(id, data);
    return this.webhookRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.webhookRepo.delete(id);
  }

  async incrementSuccessCount(id: string): Promise<void> {
    await this.webhookRepo.increment({ id }, 'successCount', 1);
  }

  async incrementFailureCount(id: string): Promise<void> {
    await this.webhookRepo.increment({ id }, 'failureCount', 1);
  }
}
