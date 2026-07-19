import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimitPolicy } from './entities/rate-limit-policy.entity';
import { RateLimitBucket } from './entities/rate-limit-bucket.entity';
import { RateLimitPolicyService } from './services/rate-limit-policy.service';
import { RateLimitPolicyController } from './controllers/rate-limit-policy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RateLimitPolicy, RateLimitBucket])],
  controllers: [RateLimitPolicyController],
  providers: [RateLimitPolicyService],
  exports: [TypeOrmModule],
})
export class RateLimitModule {}
