import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeChannel } from './entities/realtime-channel.entity';
import { RealtimeSession } from './entities/realtime-session.entity';
import { RealtimeChannelService } from './services/realtime-channel.service';
import { RealtimeChannelController } from './controllers/realtime-channel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RealtimeChannel, RealtimeSession])],
  controllers: [RealtimeChannelController],
  providers: [RealtimeChannelService],
  exports: [TypeOrmModule],
})
export class RealtimeModule {}
