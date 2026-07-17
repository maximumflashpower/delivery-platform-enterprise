import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ChatRoomService } from '../services/chat-room.service';
import { ChatRoom } from '../entities/chat-room.entity';

@Controller('chat/rooms')
export class ChatRoomController {
  constructor(private readonly roomService: ChatRoomService) {}

  @Get()
  findAll(): Promise<ChatRoom[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ChatRoom | null> {
    return this.roomService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<ChatRoom>): Promise<ChatRoom> {
    return this.roomService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<ChatRoom>): Promise<ChatRoom | null> {
    return this.roomService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.roomService.remove(id);
  }
}
