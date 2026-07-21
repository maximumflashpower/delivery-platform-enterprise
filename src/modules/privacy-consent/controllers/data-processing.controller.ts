import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataProcessingService } from '../services/data-processing.service';
import { DataProcessingRecord } from '../entities/data-processing-record.entity';

@ApiTags('data-processing')
@Controller('privacy-consent/data-processing')
export class DataProcessingController {
  constructor(private readonly service: DataProcessingService) {}

  @Post()
  @ApiOperation({ summary: 'Create data processing record' })
  @ApiResponse({ status: 201, type: DataProcessingRecord })
  create(@Body() data: Partial<DataProcessingRecord>): Promise<DataProcessingRecord> {
    return this.service.create(data);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all processing records for user' })
  @ApiResponse({ status: 200, type: [DataProcessingRecord] })
  findByUser(@Param('userId') userId: string): Promise<DataProcessingRecord[]> {
    return this.service.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific processing record' })
  @ApiResponse({ status: 200, type: DataProcessingRecord })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DataProcessingRecord> {
    return this.service.findOne(id);
  }

  @Patch(':id/end')
  @ApiOperation({ summary: 'End data processing' })
  @ApiResponse({ status: 200, type: DataProcessingRecord })
  endProcessing(@Param('id', ParseUUIDPipe) id: string): Promise<DataProcessingRecord> {
    return this.service.endProcessing(id);
  }

  @Patch(':id/retention')
  @ApiOperation({ summary: 'Update retention policy' })
  @ApiResponse({ status: 200, type: DataProcessingRecord })
  updateRetention(@Param('id', ParseUUIDPipe) id: string, @Body('policy') policy: string): Promise<DataProcessingRecord> {
    return this.service.updateRetention(id, policy);
  }
}
