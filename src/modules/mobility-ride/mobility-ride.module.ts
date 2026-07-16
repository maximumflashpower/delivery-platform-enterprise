import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ride } from './entities/ride.entity';
import { MobilityRideService } from './services/mobility-ride.service';
import { MobilityRideController } from './controllers/mobility-ride.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ride])],
  controllers: [MobilityRideController],
  providers: [MobilityRideService],
  exports: [TypeOrmModule, MobilityRideService],
})
export class MobilityRideModule {}
