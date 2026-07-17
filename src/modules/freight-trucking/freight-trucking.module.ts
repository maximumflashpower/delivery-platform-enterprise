import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrier } from './entities/carrier.entity';
import { Shipment } from './entities/shipment.entity';
import { BillOfLading } from './entities/bill-of-lading.entity';
import { CarrierService } from './services/carrier.service';
import { ShipmentService } from './services/shipment.service';
import { BillOfLadingService } from './services/bill-of-lading.service';
import { CarrierController } from './controllers/carrier.controller';
import { ShipmentController } from './controllers/shipment.controller';
import { BillOfLadingController } from './controllers/bill-of-lading.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Carrier, Shipment, BillOfLading])],
  controllers: [CarrierController, ShipmentController, BillOfLadingController],
  providers: [CarrierService, ShipmentService, BillOfLadingService],
  exports: [TypeOrmModule, CarrierService, ShipmentService, BillOfLadingService],
})
export class FreightTruckingModule {}
