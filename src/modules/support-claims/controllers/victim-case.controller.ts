import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VictimCaseService } from '../services/victim-case.service';
import { CreateVictimCaseDto } from '../dto/create-victim-case.dto';

@ApiTags('Support Claims - Victim Cases')
@Controller('api/support-claims/victim-cases')
export class VictimCaseController {
  constructor(private readonly service: VictimCaseService) {}

  @Post()
  @ApiOperation({ summary: 'Open victim support case' })
  async create(@Body() dto: CreateVictimCaseDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List cases by user' })
  @ApiQuery({ name: 'userId', required: false })
  async list(@Query('userId') userId?: string) {
    if (userId) return this.service.findByUser(userId);
    return this.service.getActiveCases();
  }

  @Get('urgent')
  @ApiOperation({ summary: 'Get urgent cases' })
  async getUrgent() {
    return this.service.getUrgentCases();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case details' })
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign case to agent' })
  @ApiQuery({ name: 'agentId', required: true })
  async assign(@Param('id') id: string, @Query('agentId') agentId: string) {
    return this.service.assign(id, agentId);
  }

  @Patch(':id/safety-plan')
  @ApiOperation({ summary: 'Update safety plan' })
  async updateSafetyPlan(
    @Param('id') id: string,
    @Body() body: { plan: string },
  ) {
    return this.service.updateSafetyPlan(id, body.plan);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close case' })
  @ApiQuery({ name: 'reason', required: true })
  async close(@Param('id') id: string, @Query('reason') reason: string) {
    return this.service.close(id, reason);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get case statistics' })
  async getStats() {
    return this.service.getStats();
  }
}
