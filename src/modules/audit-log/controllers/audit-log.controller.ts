import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';
import { AuditLog } from '../entities/audit-log.entity';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  findAll(@Query('userId') userId?: string, @Query('limit') limit = '100'): Promise<AuditLog[]> {
    return this.auditLogService.findAll(userId, parseInt(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AuditLog | null> {
    return this.auditLogService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<AuditLog>): Promise<AuditLog> {
    return this.auditLogService.create(data);
  }
}
