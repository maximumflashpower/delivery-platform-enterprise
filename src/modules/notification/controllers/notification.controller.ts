import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../entities/notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @PublicRoute()
  @Get()
  findAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Notification>): Promise<Notification> {
    return this.notificationService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Notification>): Promise<Notification | null> {
    return this.notificationService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.notificationService.remove(id);
  }
}
