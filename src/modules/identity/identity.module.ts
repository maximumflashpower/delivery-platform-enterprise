import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserControl } from './entities/user-control.entity';
import { ExplainabilityRecord } from './entities/explainability-record.entity';
import { ControlAuditLog } from './entities/control-audit-log.entity';
import { UserControlService } from './services/user-control.service';
import { ExplainabilityService } from './services/explainability.service';
import { UserControlController } from './controllers/user-control.controller';
import { ExplainabilityController } from './controllers/explainability.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserControl, ExplainabilityRecord, ControlAuditLog]),
  ],
  controllers: [UserControlController, ExplainabilityController],
  providers: [UserControlService, ExplainabilityService],
  exports: [UserControlService, ExplainabilityService],
})
export class IdentityModule {}
