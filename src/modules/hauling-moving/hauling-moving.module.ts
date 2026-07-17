import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hauler } from './entities/hauler.entity';
import { Load } from './entities/load.entity';
import { MovingRequest } from './entities/moving-request.entity';
import { HaulerService } from './services/hauler.service';
import { LoadService } from './services/load.service';
import { MovingRequestService } from './services/moving-request.service';
import { HaulerController } from './controllers/hauler.controller';
import { LoadController } from './controllers/load.controller';
import { MovingRequestController } from './controllers/moving-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hauler, Load, MovingRequest])],
  controllers: [HaulerController, LoadController, MovingRequestController],
  providers: [HaulerService, LoadService, MovingRequestService],
  exports: [TypeOrmModule, HaulerService, LoadService, MovingRequestService],
})
export class HaulingMovingModule {}
