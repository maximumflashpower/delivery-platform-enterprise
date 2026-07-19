import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { SurfaceRoutingService } from './services/surface-routing.service';
import { SurfaceRoutingController } from './controllers/surface-routing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  controllers: [SurfaceRoutingController],
  providers: [SurfaceRoutingService],
  exports: [TypeOrmModule, SurfaceRoutingService],
})
export class SurfaceRoutingModule {}
