import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from './entities/service-provider.entity';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceBooking } from './entities/service-booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider, ServiceCategory, ServiceBooking])],
  exports: [TypeOrmModule],
})
export class LocalServicesModule {}
