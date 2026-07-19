import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courier } from './entities/courier.entity';
import { CourierAssignment } from './entities/courier-assignment.entity';
import { DeliveryBatch } from './entities/delivery-batch.entity';
import { CourierService } from './services/courier.service';
import { DeliveryBatchService } from './services/delivery-batch.service';
import { CourierAssignmentService } from './services/courier-assignment.service';
import { CourierController } from './controllers/courier.controller';
import { DeliveryBatchController } from './controllers/delivery-batch.controller';
import { CourierAssignmentController } from './controllers/courier-assignment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Courier, CourierAssignment, DeliveryBatch])],
  controllers: [CourierController, DeliveryBatchController, CourierAssignmentController],
  providers: [CourierService, DeliveryBatchService, CourierAssignmentService],
  exports: [TypeOrmModule, CourierService, DeliveryBatchService, CourierAssignmentService],
})
export class DeliveryCourierModule {}
