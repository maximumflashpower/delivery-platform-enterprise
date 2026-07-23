import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AgentSandboxService } from '../services/agent-sandbox.service';
import { CreateSandboxDto, ExecuteInSandboxDto, TerminateSandboxDto } from '../dto/agent-sandbox.dto';

@ApiTags('Agent Sandbox Environment')
@Controller('agent-sandbox')
export class AgentSandboxController {
  constructor(private readonly service: AgentSandboxService) {}

  @Get()
  @ApiOperation({ summary: 'List all sandboxes (optionally filtered by agentId)' })
  async findAll(@Query('agentId') agentId?: string) {
    return this.service.findAll(agentId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get sandbox statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sandbox by ID' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get(':id/executions')
  @ApiOperation({ summary: 'List executions for a sandbox' })
  async getExecutions(@Param('id') id: string) {
    return this.service.getExecutions(id);
  }

  @Get(':id/snapshots')
  @ApiOperation({ summary: 'List resource snapshots for a sandbox' })
  async getSnapshots(@Param('id') id: string) {
    return this.service.getSnapshots(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sandbox instance' })
  async create(@Body() dto: CreateSandboxDto) {
    return this.service.create(dto);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a sandbox' })
  async start(@Param('id') id: string) {
    return this.service.start(id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause a running sandbox' })
  async pause(@Param('id') id: string) {
    return this.service.pause(id);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a paused sandbox' })
  async resume(@Param('id') id: string) {
    return this.service.resume(id);
  }

  @Post(':id/terminate')
  @ApiOperation({ summary: 'Terminate a sandbox' })
  async terminate(@Param('id') id: string, @Body() dto: TerminateSandboxDto) {
    return this.service.terminate(id, dto);
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute a task inside a sandbox' })
  async execute(@Body() dto: ExecuteInSandboxDto) {
    return this.service.execute(dto);
  }

  @Get('executions/:execId')
  @ApiOperation({ summary: 'Get execution details by ID' })
  async getExecutionById(@Param('execId') execId: string) {
    return this.service.getExecutionById(execId);
  }
}
