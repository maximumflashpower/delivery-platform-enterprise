import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from './entities/merchant.entity';
import { MerchantContract } from './entities/merchant-contract.entity';
import { MerchantInvoice } from './entities/merchant-invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, MerchantContract, MerchantInvoice])],
  exports: [TypeOrmModule],
})
export class MerchantB2bModule {}
