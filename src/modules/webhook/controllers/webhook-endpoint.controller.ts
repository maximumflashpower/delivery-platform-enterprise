import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { WebhookEndpointService } from '../services/webhook-endpoint.service';
import { WebhookEndpoint } from '../entities/webhook-endpoint.entity';

@Controller('webhooks/endpoints')
export class WebhookEndpointController {
  constructor(private readonly webhookService: WebhookEndpointService) {}

  @Get()
  findAll(@Query('ownerUserId') ownerUserId?: string): Promise<WebhookEndpoint[]> {
    return this.webhookService.findAll(ownerUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<WebhookEndpoint | null> {
    return this.webhookService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<WebhookEndpoint>): Promise<WebhookEndpoint> {
    return this.webhookService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<WebhookEndpoint>): Promise<WebhookEndpoint | null> {
    return this.webhookService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.webhookService.remove(id);
  }
}
