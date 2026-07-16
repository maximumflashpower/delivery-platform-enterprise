import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from '@nestjs/core';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import swaggerConfig from './config/swagger.config';
import throttlerConfig from './config/throttler.config';
import redisConfig from './config/redis.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Foundation Cores
import { IdentityModule } from './modules/identity/identity.module';
import { RoleProfileModule } from './modules/role-profile/role-profile.module';
import { TrustSafetyModule } from './modules/trust-safety/trust-safety.module';
import { FinancialLedgerModule } from './modules/financial-ledger/financial-ledger.module';
import { PayoutModule } from './modules/payout/payout.module';
import { VehicleCapabilityModule } from './modules/vehicle-capability/vehicle-capability.module';
import { MobilityRideModule } from './modules/mobility-ride/mobility-ride.module';
import { SurfaceRoutingModule } from './modules/surface-routing/surface-routing.module';

// Governance
import { GovernanceModule } from './modules/governance/governance.module';

// Domain Modules
import { DriverOperatorModule } from './modules/driver-operator/driver-operator.module';
import { DeliveryCourierModule } from './modules/delivery-courier/delivery-courier.module';
import { MerchantB2bModule } from './modules/merchant-b2b/merchant-b2b.module';
import { HostTravelModule } from './modules/host-travel/host-travel.module';
import { HaulingMovingModule } from './modules/hauling-moving/hauling-moving.module';
import { FreightTruckingModule } from './modules/freight-trucking/freight-trucking.module';
import { RoutingNavigationModule } from './modules/routing-navigation/routing-navigation.module';
import { ProofServiceModule } from './modules/proof-service/proof-service.module';
import { PrivacyConsentModule } from './modules/privacy-consent/privacy-consent.module';
import { SupportClaimsModule } from './modules/support-claims/support-claims.module';

// Modern Feature Modules
import { MLPipelineModule } from './modules/ml-pipeline/ml-pipeline.module';
import { BiometricSecurityModule } from './modules/biometric-security/biometric-security.module';
import { CarbonSustainabilityModule } from './modules/carbon-sustainability/carbon-sustainability.module';
import { DeveloperPlatformModule } from './modules/developer-platform/developer-platform.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { SmartContractModule } from './modules/smart-contract/smart-contract.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { AccessibilityModule } from './modules/accessibility/accessibility.module';
import { ExperimentationModule } from './modules/experimentation/experimentation.module';
import { AnalyticsObservabilityModule } from './modules/analytics-observability/analytics-observability.module';
import { LocalServicesModule } from './modules/local-services/local-services.module';

// Cross-Cutting Modules
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StorageModule } from './modules/storage/storage.module';
import { ChatModule } from './modules/chat/chat.module';
import { SearchModule } from './modules/search/search.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { IntegrationGatewayModule } from './modules/integration-gateway/integration-gateway.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { LocalizationModule } from './modules/localization/localization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, swaggerConfig, throttlerConfig, redisConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    IdentityModule,
    RoleProfileModule,
    TrustSafetyModule,
    FinancialLedgerModule,
    PayoutModule,
    VehicleCapabilityModule,
    MobilityRideModule,
    SurfaceRoutingModule,
    GovernanceModule,
    DriverOperatorModule,
    DeliveryCourierModule,
    MerchantB2bModule,
    HostTravelModule,
    HaulingMovingModule,
    FreightTruckingModule,
    RoutingNavigationModule,
    ProofServiceModule,
    PrivacyConsentModule,
    SupportClaimsModule,
    MLPipelineModule,
    BiometricSecurityModule,
    CarbonSustainabilityModule,
    DeveloperPlatformModule,
    GamificationModule,
    SmartContractModule,
    WellnessModule,
    AccessibilityModule,
    ExperimentationModule,
    AnalyticsObservabilityModule,
    LocalServicesModule,
    AuthModule,
    AuditModule,
    NotificationsModule,
    StorageModule,
    ChatModule,
    SearchModule,
    SchedulingModule,
    IntegrationGatewayModule,
    RealtimeModule,
    LocalizationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
