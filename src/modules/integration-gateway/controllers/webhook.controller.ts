import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { WebhookService } from '../services/webhook.service';
import { Webhook } from '../entities/webhook.entity';

@Controller('integration/webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  findAll(@Query('isActive') isActive?: string): Promise<Webhook[]> {
    return this.webhookService.findAll(isActive === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Webhook | null> {
    return this.webhookService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Webhook>): Promise<Webhook> {
    return this.webhookService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Webhook>): Promise<Webhook | null> {
    return this.webhookService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.webhookService.remove(id);
  }
}
