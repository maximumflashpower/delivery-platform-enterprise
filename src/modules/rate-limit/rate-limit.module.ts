import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimitConfig } from './entities/rate-limit-config.entity';
import { RateLimitUsage } from './entities/rate-limit-usage.entity';
import { CircuitBreakerState } from './entities/circuit-breaker-state.entity';
import { RateLimitService } from './services/rate-limit.service';
import { RateLimitController } from './controllers/rate-limit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RateLimitConfig, RateLimitUsage, CircuitBreakerState])],
  controllers: [RateLimitController],
  providers: [RateLimitService],
  exports: [TypeOrmModule, RateLimitService],
})
export class RateLimitModule {}
