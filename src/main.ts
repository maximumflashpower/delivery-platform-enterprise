import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { winstonConfig } from './config/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) =>
        new BadRequestException(errors.map((e) => e.constraints)),
    }),
  );

  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
  const corsOrigin = configService.get<string>('app.corsOrigin') || 'http://localhost:3001';
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // JWT Auth guard (global)
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  // Validation pipe (global)

  // Exception filter (global)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Logging interceptor (global)
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger
  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Delivery Platform Enterprise API')
      .setDescription(`
# 🚀 Delivery Platform Enterprise API

Multi-domain delivery and logistics platform built with NestJS + TypeORM.

## 🔐 Authentication

All endpoints (except those marked as **Public**) require a valid JWT Bearer token.

### Auth Flow:
1. **Register** → \`POST /api/auth/register\` (returns devOtp in development)
2. **Verify OTP** → \`POST /api/auth/verify-otp\` (returns accessToken + refreshToken)
3. **Login** → \`POST /api/auth/login\` (alternative: phone/email + password)
4. **Refresh** → \`POST /api/auth/refresh\` (rotate tokens)
5. **Protected endpoints** → Add \`Authorization: Bearer <token>\` header

## 📊 Domains

| Domain | Description |
|--------|-------------|
| **Auth** | Registration, login, OTP, password management |
| **Identity** | Users, roles, sessions, devices, verifications |
| **Financial** | Accounts, journal entries, payouts |
| **Governance** | Policies, compliance records |
| **Chat** | Real-time messaging, rooms |
| **Wellness** | Goals, activities, health tracking |
| **ML** | Model versions, prediction logs |
| **Trust & Safety** | Scores, incidents, verification badges |
| **Feature Flags** | Toggle features, rollout strategies |
| **Notifications** | Templates, preferences, delivery |
| **Analytics** | Events, reports |
| **Observability** | System metrics, alert rules |
| **Sustainability** | Carbon credits, sustainability metrics |
| **Gamification** | Achievements, user progress |
| **Blockchain** | Smart contracts, executions |
| **Accessibility** | Profiles, settings |
| **Integration** | API keys, external services, webhooks |
| **Realtime** | Channels, sessions |
| **Search** | Job indexing, search logs |
| **Scheduling** | Jobs, schedules |
| **Logistics** | Drivers, couriers, shipments, carriers |
| **Commerce** | Merchants, invoices, contracts |
| **Travel** | Hosts, listings, reservations |
| **Freight** | Haulers, loads, moving requests |

## 📝 Notes

- Development database: **SQLite**
- Production database: **PostgreSQL**
- All timestamps are in **ISO 8601** format (UTC)
- Rate limiting: **100 requests per minute** per IP
      `)
      .setVersion('1.0.0')
      .addTag('Auth', 'Authentication & authorization endpoints')
      .addTag('Identity', 'User management, roles, sessions, devices')
      .addTag('Financial', 'Accounts, journal entries, payouts')
      .addTag('Governance', 'Policies, compliance records')
      .addTag('Chat', 'Real-time messaging, rooms')
      .addTag('Wellness', 'Goals, activities, health tracking')
      .addTag('ML', 'Machine learning models and predictions')
      .addTag('Trust & Safety', 'Scores, incidents, verification badges')
      .addTag('Feature Flags', 'Feature toggles and rollout strategies')
      .addTag('Notifications', 'Templates, preferences, delivery')
      .addTag('Analytics', 'Events, reports, dashboards')
      .addTag('Observability', 'System metrics, alerts, monitoring')
      .addTag('Sustainability', 'Carbon credits, sustainability metrics')
      .addTag('Gamification', 'Achievements, user progress, rewards')
      .addTag('Blockchain', 'Smart contracts, executions')
      .addTag('Accessibility', 'Profiles, settings, accommodations')
      .addTag('Integration', 'API keys, external services, webhooks')
      .addTag('Realtime', 'Channels, sessions, live updates')
      .addTag('Search', 'Job indexing, search logs')
      .addTag('Scheduling', 'Jobs, schedules, task management')
      .addTag('Logistics - Drivers', 'Driver operator management')
      .addTag('Logistics - Couriers', 'Courier assignments, delivery batches')
      .addTag('Logistics - Freight', 'Haulers, loads, moving requests')
      .addTag('Logistics - Shipping', 'Carriers, shipments, bills of lading')
      .addTag('Logistics - Claims', 'Claim tickets, status logs')
      .addTag('Logistics - Services', 'Service providers, bookings, categories')
      .addTag('Commerce - Merchants', 'Merchant management, contracts, invoices')
      .addTag('Travel - Hosts', 'Host management, listings, reservations')
      .addTag('Admin', 'Role profiles, administration')
      .addTag('Configuration', 'System configuration, history')
      .addTag('Audit', 'Audit logs, events')
      .addTag('Files', 'File storage, buckets')
      .addTag('Rate Limiting', 'Rate limit configs, policies, buckets')
      .addTag('Languages', 'Languages, translations')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT access token (from /api/auth/login or /api/auth/verify-otp)',
          in: 'header',
        },
        'access-token',
      )
      .addServer('http://localhost:3000', 'Development server')
      .addServer('https://api.delivery-platform.com', 'Production server')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      customSiteTitle: 'Delivery Platform API Docs',
      customfavIcon: 'https://nestjs.com/img/logo-small.svg',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        displayRequestDuration: true,
      },
    });

    logger.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
  }

  await app.listen(port);
  logger.log(`🚀 Application running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`❤️  Health check: http://localhost:${port}/health`);
}

bootstrap();
