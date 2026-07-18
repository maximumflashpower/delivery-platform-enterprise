import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { RealtimeChannelService } from '../services/realtime-channel.service';
import { RealtimeChannel } from '../entities/realtime-channel.entity';

@Controller('realtime/channels')
export class RealtimeChannelController {
  constructor(private readonly channelService: RealtimeChannelService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('isActive') isActive?: string): Promise<RealtimeChannel[]> {
    return this.channelService.findAll(isActive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RealtimeChannel | null> {
    return this.channelService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<RealtimeChannel>): Promise<RealtimeChannel> {
    return this.channelService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<RealtimeChannel>): Promise<RealtimeChannel | null> {
    return this.channelService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.channelService.remove(id);
  }
}
