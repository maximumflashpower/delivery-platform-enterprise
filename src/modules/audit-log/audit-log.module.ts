import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditEvent } from './entities/audit-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuditLog,
      AuditEvent,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class AuditLogModule {}
