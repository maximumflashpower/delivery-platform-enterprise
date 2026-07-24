import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AbuseSimulationService } from '../services/abuse-simulation.service';
import { CreateSimulationDto, UpdateSimulationStatusDto, ExecuteSimulationDto } from '../dto/abuse-simulation.dto';

@ApiTags('Abuse Simulation Center')
@Controller('analytics/abuse-simulations')
export class AbuseSimulationController {
  constructor(private readonly service: AbuseSimulationService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get abuse simulation stats' })
  async getStats() {
    return this.service.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'List all simulations' })
  async list(@Query('status') status?: string, @Query('type') type?: string) {
    return this.service.findAll({ status, type });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get simulation by ID' })
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new simulation' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateSimulationDto) {
    return this.service.create(dto);
  }

  @Post(':id/schedule')
  @ApiOperation({ summary: 'Schedule simulation' })
  async schedule(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.schedule(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start execution' })
  async start(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.start(id);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update progress' })
  async updateProgress(@Param('id', ParseUUIDPipe) id: string, @Body() progress: { executedRequests: number; successfulAttacks?: number; blockedAttacks?: number }) {
    return this.service.updateProgress(id, progress);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark as completed' })
  async complete(@Param('id', ParseUUIDPipe) id: string, @Body() body: { findings: string; recommendations: string }) {
    return this.service.complete(id, body.findings, body.recommendations);
  }

  @Post(':id/fail')
  @ApiOperation({ summary: 'Mark as failed' })
  async fail(@Param('id', ParseUUIDPipe) id: string, @Body('error') error: string) {
    return this.service.fail(id, error);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel simulation' })
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.cancel(id);
  }
}
