import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from './entities/merchant.entity';
import { MerchantContract } from './entities/merchant-contract.entity';
import { MerchantInvoice } from './entities/merchant-invoice.entity';
import { MerchantService } from './services/merchant.service';
import { MerchantContractService } from './services/merchant-contract.service';
import { MerchantInvoiceService } from './services/merchant-invoice.service';
import { MerchantController } from './controllers/merchant.controller';
import { MerchantContractController } from './controllers/merchant-contract.controller';
import { MerchantInvoiceController } from './controllers/merchant-invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, MerchantContract, MerchantInvoice])],
  controllers: [MerchantController, MerchantContractController, MerchantInvoiceController],
  providers: [MerchantService, MerchantContractService, MerchantInvoiceService],
  exports: [TypeOrmModule, MerchantService, MerchantContractService, MerchantInvoiceService],
})
export class MerchantB2bModule {}
