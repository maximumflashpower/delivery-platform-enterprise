import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './entities/api-key.entity';
import { ExternalService } from './entities/external-service.entity';
import { Webhook } from './entities/webhook.entity';
import { ApiKeyService } from './services/api-key.service';
import { ApiKeyController } from './controllers/api-key.controller';
import { WebhookService } from './services/webhook.service';
import { WebhookController } from './controllers/webhook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey, ExternalService, Webhook])],
  controllers: [ApiKeyController, WebhookController],
  providers: [ApiKeyService, WebhookService],
  exports: [TypeOrmModule],
})
export class IntegrationGatewayModule {}
