import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContextFirewallService } from '../services/context-firewall.service';
import { CreateFirewallRuleDto, CreateContextProfileDto, FilterContextDto } from '../dto/context-firewall.dto';

@ApiTags('Trust Safety - Context Firewall')
@Controller('trust-safety/context-firewall')
export class ContextFirewallController {
  constructor(private readonly service: ContextFirewallService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get global context firewall statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('agents/:agentId/stats')
  @ApiOperation({ summary: 'Get per-agent firewall statistics' })
  async getAgentStats(@Param('agentId') agentId: string) {
    return this.service.getAgentStats(agentId);
  }

  @Get('rules/agent/:agentId')
  @ApiOperation({ summary: 'Get firewall rules for an agent' })
  async findRulesByAgent(@Param('agentId') agentId: string, @Query('activeOnly') activeOnly?: string) {
    return this.service.findRulesByAgent(agentId, activeOnly === 'true');
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Get firewall rule by ID' })
  async findRuleById(@Param('id') id: string) {
    return this.service.findRuleById(id);
  }

  @Get('profiles/agent/:agentId')
  @ApiOperation({ summary: 'Get context profile for an agent' })
  async findProfileByAgent(@Param('agentId') agentId: string) {
    return this.service.findProfileByAgent(agentId);
  }

  @Get('profiles/:id')
  @ApiOperation({ summary: 'Get context profile by ID' })
  async findProfileById(@Param('id') id: string) {
    return this.service.findProfileById(id);
  }

  @Get('logs/agent/:agentId')
  @ApiOperation({ summary: 'Get filter logs for an agent' })
  async findLogsByAgent(@Param('agentId') agentId: string, @Query('limit') limit?: string) {
    return this.service.findLogsByAgent(agentId, limit ? parseInt(limit) : 50);
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Get filter log by ID' })
  async findLogById(@Param('id') id: string) {
    return this.service.findLogById(id);
  }

  @Post('rules')
  @ApiOperation({ summary: 'Create a firewall rule' })
  async createRule(@Body() dto: CreateFirewallRuleDto) {
    return this.service.createRule(dto);
  }

  @Post('profiles')
  @ApiOperation({ summary: 'Create a context profile for an agent' })
  async createProfile(@Body() dto: CreateContextProfileDto) {
    return this.service.createProfile(dto);
  }

  @Post('filter')
  @ApiOperation({ summary: 'Filter context through the firewall' })
  async filterContext(@Body() dto: FilterContextDto) {
    return this.service.filterContext(dto);
  }

  @Post('rules/:id/delete')
  @ApiOperation({ summary: 'Archive (soft delete) a firewall rule' })
  async deleteRule(@Param('id') id: string) {
    await this.service.deleteRule(id);
    return { id, status: 'archived' };
  }
}
