import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AgentToolInventoryService } from '../services/agent-tool-inventory.service';
import { CreateToolInventoryDto } from '../dto/agent-security-test.dto';

@ApiTags('Trust Safety - Agent Tool Inventory')
@Controller('trust-safety/agent-tools')
export class AgentToolInventoryController {
  constructor(private readonly service: AgentToolInventoryService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get tool inventory statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'Get all tools for an agent' })
  async findByAgent(@Param('agentId') agentId: string) {
    return this.service.findByAgent(agentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tool inventory entry by ID' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a tool in the inventory' })
  async registerTool(@Body() dto: CreateToolInventoryDto) {
    return this.service.registerTool(dto);
  }

  @Post(':id/quarantine')
  @ApiOperation({ summary: 'Quarantine a tool' })
  async quarantine(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.service.quarantine(id, reason);
  }

  @Post(':id/enable')
  @ApiOperation({ summary: 'Enable a tool' })
  async enable(@Param('id') id: string) {
    return this.service.enable(id);
  }

  @Post(':id/restrict')
  @ApiOperation({ summary: 'Restrict a tool' })
  async restrict(@Param('id') id: string) {
    return this.service.restrict(id);
  }
}
