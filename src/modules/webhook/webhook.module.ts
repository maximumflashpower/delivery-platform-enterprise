import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookEndpoint } from './entities/webhook-endpoint.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { WebhookDelivery } from './entities/webhook-delivery.entity';
import { WebhookEndpointService } from './services/webhook-endpoint.service';
import { WebhookEndpointController } from './controllers/webhook-endpoint.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookEndpoint, WebhookEvent, WebhookDelivery])],
  controllers: [WebhookEndpointController],
  providers: [WebhookEndpointService],
  exports: [TypeOrmModule],
})
export class WebhookModule {}
