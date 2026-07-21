import { Controller, Get, Post, Body, Param, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReasonCodeService } from '../services/reason-code.service';
import { CreateReasonCodeDto } from '../dto/create-reason-code.dto';

@ApiTags('Trust & Safety - Reason Codes')
@Controller('trust-safety/reasons')
export class ReasonCodeController {
  constructor(private readonly service: ReasonCodeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a reason code' })
  async create(@Body() dto: CreateReasonCodeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List reason codes' })
  @ApiResponse({ status: 200, description: 'List of reason codes' })
  async getAll(@Query('active') active?: string) {
    return this.service.findAll(active === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reason code by ID' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get reason code by code value' })
  async findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate reason code' })
  async deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }
}
