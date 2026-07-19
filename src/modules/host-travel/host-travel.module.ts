import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Host } from './entities/host.entity';
import { Listing } from './entities/listing.entity';
import { Reservation } from './entities/reservation.entity';
import { HostService } from './services/host.service';
import { ListingService } from './services/listing.service';
import { ReservationService } from './services/reservation.service';
import { HostController } from './controllers/host.controller';
import { ListingController } from './controllers/listing.controller';
import { ReservationController } from './controllers/reservation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Host, Listing, Reservation])],
  controllers: [HostController, ListingController, ReservationController],
  providers: [HostService, ListingService, ReservationService],
  exports: [TypeOrmModule, HostService, ListingService, ReservationService],
})
export class HostTravelModule {}
