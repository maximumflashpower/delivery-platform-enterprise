import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtimeChannel } from '../entities/realtime-channel.entity';

@Injectable()
export class RealtimeChannelService {
  constructor(
    @InjectRepository(RealtimeChannel)
    private readonly channelRepo: Repository<RealtimeChannel>,
  ) {}

  async findAll(isActive?: boolean): Promise<RealtimeChannel[]> {
    return this.channelRepo.find({ where: isActive !== undefined ? { isActive } as any : {} });
  }

  async findOne(id: string): Promise<RealtimeChannel | null> {
    return this.channelRepo.findOneBy({ id });
  }

  async create(data: Partial<RealtimeChannel>): Promise<RealtimeChannel> {
    const entity = this.channelRepo.create(data);
    return this.channelRepo.save(entity);
  }

  async update(id: string, data: Partial<RealtimeChannel>): Promise<RealtimeChannel | null> {
    await this.channelRepo.update(id, data);
    return this.channelRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.channelRepo.delete(id);
  }
}
