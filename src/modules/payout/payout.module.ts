import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payout } from './entities/payout.entity';
import { PayoutService } from './services/payout.service';
import { PayoutController } from './controllers/payout.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payout])],
  controllers: [PayoutController],
  providers: [PayoutService],
  exports: [TypeOrmModule, PayoutService],
})
export class PayoutModule {}
