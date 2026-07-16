import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ride } from './entities/ride.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ride])],
  exports: [TypeOrmModule],
})
export class MobilityRideModule {}
