import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicRoute } from './common/decorators/public-route.decorator';
import { AuthModule } from './modules/auth/auth.module';
import { IdentityModule } from './modules/identity/identity.module';
import { FinancialLedgerModule } from './modules/financial-ledger/financial-ledger.module';
import { PayoutModule } from './modules/payout/payout.module';
import { TrustSafetyModule } from './modules/trust-safety/trust-safety.module';
import { SurfaceRoutingModule } from './modules/surface-routing/surface-routing.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { RoleProfileModule } from './modules/role-profile/role-profile.module';
import { VehicleCapabilityModule } from './modules/vehicle-capability/vehicle-capability.module';
import { MobilityRideModule } from './modules/mobility-ride/mobility-ride.module';
import { DriverOperatorModule } from './modules/driver-operator/driver-operator.module';
import { DeliveryCourierModule } from './modules/delivery-courier/delivery-courier.module';
import { MerchantB2bModule } from './modules/merchant-b2b/merchant-b2b.module';
import { HostTravelModule } from './modules/host-travel/host-travel.module';
import { FreightTruckingModule } from './modules/freight-trucking/freight-trucking.module';
import { SupportClaimsModule } from './modules/support-claims/support-claims.module';
import { LocalServicesModule } from './modules/local-services/local-services.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { SearchModule } from './modules/search/search.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { IntegrationGatewayModule } from './modules/integration-gateway/integration-gateway.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { FeatureFlagModule } from './modules/feature-flag/feature-flag.module';
import { ExperimentationModule } from './modules/experimentation/experimentation.module';
import { AccessibilityModule } from './modules/accessibility/accessibility.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { SmartContractModule } from './modules/smart-contract/smart-contract.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { CarbonSustainabilityModule } from './modules/carbon-sustainability/carbon-sustainability.module';
import { BiometricSecurityModule } from './modules/biometric-security/biometric-security.module';
import { MLPipelineModule } from './modules/ml-pipeline/ml-pipeline.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AnalyticsObservabilityModule } from './modules/analytics-observability/analytics-observability.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { ChatModule } from './modules/chat/chat.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 3, // 3 requests por segundo (anti spam)
      },
      {
        name: 'medium',
        ttl: 10000, // 10 segundos
        limit: 20, // 20 requests por 10 segundos
      },
      {
        name: 'long',
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    IdentityModule,
    FinancialLedgerModule,
    PayoutModule,
    TrustSafetyModule,
    SurfaceRoutingModule,
    GovernanceModule,
    RoleProfileModule,
    VehicleCapabilityModule,
    MobilityRideModule,
    DriverOperatorModule,
    DeliveryCourierModule,
    MerchantB2bModule,
    HostTravelModule,
    FreightTruckingModule,
    SupportClaimsModule,
    LocalServicesModule,
    NotificationModule,
    AuditLogModule,
    SearchModule,
    SchedulingModule,
    IntegrationGatewayModule,
    RealtimeModule,
    WebhookModule,
    FeatureFlagModule,
    ExperimentationModule,
    AccessibilityModule,
    WellnessModule,
    SmartContractModule,
    GamificationModule,
    CarbonSustainabilityModule,
    BiometricSecurityModule,
    MLPipelineModule,
    AnalyticsModule,
    AnalyticsObservabilityModule,
    ConfigurationModule,
    FileStorageModule,
    I18nModule,
    ChatModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
