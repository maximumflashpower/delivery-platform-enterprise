import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Host } from './entities/host.entity';
import { Listing } from './entities/listing.entity';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Host, Listing, Reservation])],
  exports: [TypeOrmModule],
})
export class HostTravelModule {}
