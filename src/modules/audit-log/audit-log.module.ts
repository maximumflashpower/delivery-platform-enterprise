import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditEvent } from './entities/audit-event.entity';
import { AuditLogService } from './services/audit-log.service';
import { AuditLogController } from './controllers/audit-log.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, AuditEvent]),
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [TypeOrmModule],
})
export class AuditLogModule {}
