import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courier } from './entities/courier.entity';
import { CourierAssignment } from './entities/courier-assignment.entity';
import { DeliveryBatch } from './entities/delivery-batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courier, CourierAssignment, DeliveryBatch])],
  exports: [TypeOrmModule],
})
export class DeliveryCourierModule {}
