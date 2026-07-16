import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrier } from './entities/carrier.entity';
import { Shipment } from './entities/shipment.entity';
import { BillOfLading } from './entities/bill-of-lading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrier, Shipment, BillOfLading])],
  exports: [TypeOrmModule],
})
export class FreightTruckingModule {}
