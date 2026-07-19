import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoomService } from './services/chat-room.service';
import { ChatRoomController } from './controllers/chat-room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage])],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  exports: [TypeOrmModule],
})
export class ChatModule {}
