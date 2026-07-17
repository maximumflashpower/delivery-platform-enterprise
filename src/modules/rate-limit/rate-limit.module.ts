import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimitPolicy } from './entities/rate-limit-policy.entity';
import { RateLimitBucket } from './entities/rate-limit-bucket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RateLimitPolicy,
      RateLimitBucket,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class RateLimitModule {}
