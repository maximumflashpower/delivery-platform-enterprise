import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from './entities/service-provider.entity';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceBooking } from './entities/service-booking.entity';
import { ServiceProviderService } from './services/service-provider.service';
import { ServiceCategoryService } from './services/service-category.service';
import { ServiceBookingService } from './services/service-booking.service';
import { ServiceProviderController } from './controllers/service-provider.controller';
import { ServiceCategoryController } from './controllers/service-category.controller';
import { ServiceBookingController } from './controllers/service-booking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider, ServiceCategory, ServiceBooking])],
  controllers: [ServiceProviderController, ServiceCategoryController, ServiceBookingController],
  providers: [ServiceProviderService, ServiceCategoryService, ServiceBookingService],
  exports: [TypeOrmModule, ServiceProviderService, ServiceCategoryService, ServiceBookingService],
})
export class LocalServicesModule {}
