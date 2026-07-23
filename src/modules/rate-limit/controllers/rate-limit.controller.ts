import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RateLimitService } from '../services/rate-limit.service';
import { CreateRateLimitConfigDto, CheckRateLimitDto, RecordUsageDto } from '../dto/rate-limit.dto';

@ApiTags('Rate Limit - Agent Throttling & Circuit Breaker')
@Controller('rate-limit')
export class RateLimitController {
  constructor(private readonly service: RateLimitService) {}

  @Get('configs')
  @ApiOperation({ summary: 'List all rate limit configurations' })
  async listConfigs() {
    return this.service.listConfigs();
  }

  @Get('configs/agent/:agentId')
  @ApiOperation({ summary: 'Get active config for an agent' })
  async getConfigByAgent(@Param('agentId') agentId: string) {
    return this.service.getConfigByAgent(agentId);
  }

  @Get('configs/:id')
  @ApiOperation({ summary: 'Get config by ID' })
  async getConfigById(@Param('id') id: string) {
    return this.service.getConfigById(id);
  }

  @Get('agents/:agentId/stats')
  @ApiOperation({ summary: 'Get usage statistics for an agent' })
  async getUsageStats(@Param('agentId') agentId: string) {
    return this.service.getUsageStats(agentId);
  }

  @Get('agents/:agentId/circuit')
  @ApiOperation({ summary: 'Get circuit breaker state for an agent' })
  async getCircuitState(@Param('agentId') agentId: string) {
    return this.service.getCircuitState(agentId);
  }

  @Post('check')
  @ApiOperation({ summary: 'Check if request is allowed under rate limits' })
  async checkRateLimit(@Body() dto: CheckRateLimitDto) {
    return this.service.checkRateLimit(dto);
  }

  @Post('configs')
  @ApiOperation({ summary: 'Create rate limit configuration for an agent' })
  async createConfig(@Body() dto: CreateRateLimitConfigDto) {
    return this.service.createConfig(dto);
  }

  @Post('record')
  @ApiOperation({ summary: 'Record usage for rate limit tracking' })
  async recordUsage(@Body() dto: RecordUsageDto) {
    return this.service.recordUsage(dto);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset usage counters for an agent' })
  async resetUsage(@Body() dto: { agentId: string; sessionId?: string }) {
    await this.service.resetUsage(dto.agentId, dto.sessionId);
    return { agentId: dto.agentId, sessionId: dto.sessionId, status: 'reset' };
  }

  @Post('circuit/open')
  @ApiOperation({ summary: 'Force open circuit breaker for an agent' })
  async forceOpenCircuit(@Body() dto: { agentId: string; reason?: string }) {
    return this.service.forceOpenCircuit(dto.agentId, dto.reason);
  }

  @Post('circuit/close')
  @ApiOperation({ summary: 'Close circuit breaker for an agent' })
  async closeCircuit(@Body() dto: { agentId: string }) {
    return this.service.closeCircuit(dto.agentId);
  }
}
