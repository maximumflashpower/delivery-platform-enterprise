import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleCapabilityService } from './services/vehicle-capability.service';
import { VehicleCapabilityController } from './controllers/vehicle-capability.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehicleCapabilityController],
  providers: [VehicleCapabilityService],
  exports: [TypeOrmModule, VehicleCapabilityService],
})
export class VehicleCapabilityModule {}
