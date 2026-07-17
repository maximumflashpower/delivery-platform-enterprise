import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeChannel } from './entities/realtime-channel.entity';
import { RealtimeSession } from './entities/realtime-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealtimeChannel, RealtimeSession])],
  exports: [TypeOrmModule],
})
export class RealtimeModule {}
