import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonLoggerService } from './config/winston.config';
import * as crypto from 'crypto';

// Polyfill para Node 18 si crypto global no existe
if (typeof global.crypto === 'undefined') {
  // @ts-ignore
  global.crypto = crypto.webcrypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  
  // Logger setup (si existe)
  try {
    const logger = app.get(WinstonLoggerService);
    app.useLogger(logger);
  } catch {
    // Logger opcional
  }
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Delivery Platform API')
    .setDescription('Multi-Domain Mobility & Logistics System API')
    .setVersion('v1.0.0')
    .addTag('platform')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
