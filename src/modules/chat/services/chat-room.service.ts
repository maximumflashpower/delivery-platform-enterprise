import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly roomRepo: Repository<ChatRoom>,
  ) {}

  async findAll(): Promise<ChatRoom[]> {
    return this.roomRepo.find();
  }

  async findOne(id: string): Promise<ChatRoom | null> {
    return this.roomRepo.findOneBy({ id });
  }

  async create(data: Partial<ChatRoom>): Promise<ChatRoom> {
    const entity = this.roomRepo.create(data);
    return this.roomRepo.save(entity);
  }

  async update(id: string, data: Partial<ChatRoom>): Promise<ChatRoom | null> {
    await this.roomRepo.update(id, data);
    return this.roomRepo.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.roomRepo.delete(id);
  }
}
