import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExceptionRecordService } from '../services/exception-record.service';
import { ExceptionRecord } from '../entities/exception-record.entity';

@ApiTags('exception-records')
@Controller('trust-safety/exceptions')
export class ExceptionRecordController {
  constructor(private readonly service: ExceptionRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Request a new exception' })
  @ApiResponse({ status: 201, type: ExceptionRecord })
  create(@Body() data: Partial<ExceptionRecord>): Promise<ExceptionRecord> {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all exception records' })
  @ApiResponse({ status: 200, type: [ExceptionRecord] })
  findAll(): Promise<ExceptionRecord[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exception record' })
  @ApiResponse({ status: 200, type: ExceptionRecord })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ExceptionRecord> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exception record' })
  @ApiResponse({ status: 200, type: ExceptionRecord })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updates: Partial<ExceptionRecord>): Promise<ExceptionRecord> {
    return this.service.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exception record' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve an exception request' })
  @ApiResponse({ status: 200, type: ExceptionRecord })
  approve(@Param('id', ParseUUIDPipe) id: string, @Body() body: { approverId: string; notes?: string }): Promise<ExceptionRecord> {
    return this.service.approve(id, body.approverId, body.notes);
  }

  @Post(':id/deny')
  @ApiOperation({ summary: 'Deny an exception request' })
  @ApiResponse({ status: 200, type: ExceptionRecord })
  deny(@Param('id', ParseUUIDPipe) id: string, @Body() body: { denierId: string; reason: string }): Promise<ExceptionRecord> {
    return this.service.deny(id, body.denierId, body.reason);
  }

  @Post(':id/revoke')
  @ApiOperation({ summary: 'Revoke an approved exception' })
  @ApiResponse({ status: 200, type: ExceptionRecord })
  revoke(@Param('id', ParseUUIDPipe) id: string, @Body() body: { revokedBy: string; reason: string }): Promise<ExceptionRecord> {
    return this.service.revoke(id, body.revokedBy, body.reason);
  }
}
