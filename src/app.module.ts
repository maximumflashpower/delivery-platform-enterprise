import { AdControlModule } from './modules/ad-control/ad-control.module';
import { AccessibilityModule } from './modules/accessibility/accessibility.module';
import { BiometricSecurityModule } from './modules/biometric-security/biometric-security.module';
import { CarbonSustainabilityModule } from './modules/carbon-sustainability/carbon-sustainability.module';
import { ExperimentationModule } from './modules/experimentation/experimentation.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { MLPipelineModule } from './modules/ml-pipeline/ml-pipeline.module';
import { NotificationModule } from './modules/notification/notification.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { SmartContractModule } from './modules/smart-contract/smart-contract.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { RoleProfileModule } from './modules/role-profile/role-profile.module';
import { FeatureFlagModule } from './modules/feature-flag/feature-flag.module';
import { TrustSafetyModule } from './modules/trust-safety/trust-safety.module';
import { PrivacyConsentModule } from './modules/privacy-consent/privacy-consent.module';
import { DsarPortalModule } from './modules/dsar-portal/dsar-portal.module';
import { InferencePanelModule } from './modules/inference-panel/inference-panel.module';
import { ConsentManagementModule } from './modules/consent-management/consent-management.module';
import { SearchModule } from './modules/search/search.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ScriptEngineModule } from './modules/script-engine/script-engine.module';
import { SupportClaimsModule } from './modules/support-claims/support-claims.module';
import { IdentityModule } from './modules/identity/identity.module';
import { AuditModule } from './modules/audit/audit.module';
import { PayoutModule } from './modules/payout/payout.module';
import { FinancialLedgerModule } from './modules/financial-ledger/financial-ledger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: 'better-sqlite3',
        database: configService.get<string>('DATABASE_PATH') || './dev.db',
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLER_TTL', 60000),
          limit: config.get('THROTTLER_LIMIT', 100),
        },
      ],
      inject: [ConfigService],
    }),
    AuthModule,
    GovernanceModule,
    RoleProfileModule,
    FeatureFlagModule,
    TrustSafetyModule,
    PrivacyConsentModule,
    DsarPortalModule,
    InferencePanelModule,
    ConsentManagementModule,
    SearchModule,
    AnalyticsModule,
    ScriptEngineModule,
    SupportClaimsModule,
    IdentityModule,
    AuditModule,
    PayoutModule,
    FinancialLedgerModule,
    AdControlModule,
    AccessibilityModule,
    BiometricSecurityModule,
    CarbonSustainabilityModule,
    ExperimentationModule,
    GamificationModule,
    I18nModule,
    MLPipelineModule,
    NotificationModule,
    RealtimeModule,
    SchedulingModule,
    SmartContractModule,
    WellnessModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
