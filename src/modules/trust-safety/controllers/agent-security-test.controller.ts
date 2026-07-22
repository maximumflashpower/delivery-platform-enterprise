import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AgentSecurityTestService } from '../services/agent-security-test.service';
import { CreateAgentSecurityTestDto, RegisterResultDto } from '../dto/agent-security-test.dto';

@ApiTags('Trust Safety - Agent Security Testing')
@Controller('trust-safety/agent-security')
export class AgentSecurityTestController {
  constructor(private readonly service: AgentSecurityTestService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get agent security test statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'List all security tests' })
  async findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'Find security tests by agent ID' })
  async findByAgent(@Param('agentId') agentId: string) {
    return this.service.findByAgent(agentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get security test details' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get test results' })
  async findResults(@Param('id') id: string) {
    return this.service.findResults(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new security test' })
  async createTest(@Body() dto: CreateAgentSecurityTestDto) {
    return this.service.createTest(dto);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a security test' })
  async startTest(@Param('id') id: string) {
    return this.service.startTest(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Manually complete a security test' })
  async completeTest(@Param('id') id: string) {
    return this.service.completeTest(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a security test' })
  async cancelTest(@Param('id') id: string) {
    return this.service.cancelTest(id);
  }

  @Post('results')
  @ApiOperation({ summary: 'Register test results' })
  async registerResult(@Body() dto: RegisterResultDto) {
    return this.service.registerResult(dto);
  }
}
