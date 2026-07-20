import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DamageRecordService } from '../services/damage-record.service';
import { DamageRecord } from '../entities/damage-record.entity';

@ApiTags('damage-records')
@Controller('trust-safety/damage-records')
export class DamageRecordController {
  constructor(private readonly service: DamageRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new damage record' })
  @ApiResponse({ status: 201, type: DamageRecord })
  create(@Body() data: Partial<DamageRecord>): Promise<DamageRecord> {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all damage records' })
  @ApiResponse({ status: 200, type: [DamageRecord] })
  findAll(): Promise<DamageRecord[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a damage record' })
  @ApiResponse({ status: 200, type: DamageRecord })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DamageRecord> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a damage record' })
  @ApiResponse({ status: 200, type: DamageRecord })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updates: Partial<DamageRecord>): Promise<DamageRecord> {
    return this.service.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a damage record' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Post(':id/investigate')
  @ApiOperation({ summary: 'Start investigation on a damage record' })
  @ApiResponse({ status: 200, type: DamageRecord })
  investigate(@Param('id', ParseUUIDPipe) id: string, @Body('investigatorId') investigatorId: string): Promise<DamageRecord> {
    return this.service.investigate(id, investigatorId);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a damage record' })
  @ApiResponse({ status: 200, type: DamageRecord })
  confirm(@Param('id', ParseUUIDPipe) id: string): Promise<DamageRecord> {
    return this.service.confirm(id);
  }

  @Post(':id/resolve')
  @ApiOperation({ summary: 'Resolve a damage record' })
  @ApiResponse({ status: 200, type: DamageRecord })
  resolve(@Param('id', ParseUUIDPipe) id: string, @Body('resolutionNotes') notes: string): Promise<DamageRecord> {
    return this.service.resolve(id, notes);
  }

  @Post(':id/dismiss')
  @ApiOperation({ summary: 'Dismiss a damage record' })
  @ApiResponse({ status: 200, type: DamageRecord })
  dismiss(@Param('id', ParseUUIDPipe) id: string, @Body('reason') reason: string): Promise<DamageRecord> {
    return this.service.dismiss(id, reason);
  }
}
