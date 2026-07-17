import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationRepo.find();
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationRepo.findOneBy({ id });
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    const entity = this.notificationRepo.create(data);
    return this.notificationRepo.save(entity);
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification | null> {
    await this.notificationRepo.update(id, data);
    return this.notificationRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.notificationRepo.delete(id);
  }
}
