import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hauler } from './entities/hauler.entity';
import { Load } from './entities/load.entity';
import { MovingRequest } from './entities/moving-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hauler, Load, MovingRequest])],
  exports: [TypeOrmModule],
})
export class HaulingMovingModule {}
