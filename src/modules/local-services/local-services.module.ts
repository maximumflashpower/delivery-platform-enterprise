import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from './entities/service-provider.entity';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceBooking } from './entities/service-booking.entity';
import { CreativeListing } from './entities/creative-listing.entity';
import { ServiceProviderService } from './services/service-provider.service';
import { ServiceCategoryService } from './services/service-category.service';
import { ServiceBookingService } from './services/service-booking.service';
import { CreativeMarketplaceService } from './services/creative-marketplace.service';
import { ServiceProviderController } from './controllers/service-provider.controller';
import { ServiceCategoryController } from './controllers/service-category.controller';
import { ServiceBookingController } from './controllers/service-booking.controller';
import { CreativeMarketplaceController } from './controllers/creative-marketplace.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider, ServiceCategory, ServiceBooking, CreativeListing])],
  controllers: [ServiceProviderController, ServiceCategoryController, ServiceBookingController, CreativeMarketplaceController],
  providers: [ServiceProviderService, ServiceCategoryService, ServiceBookingService, CreativeMarketplaceService],
  exports: [TypeOrmModule, ServiceProviderService, ServiceCategoryService, ServiceBookingService, CreativeMarketplaceService],
})
export class LocalServicesModule {}
