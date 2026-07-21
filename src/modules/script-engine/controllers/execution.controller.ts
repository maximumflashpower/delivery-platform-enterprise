import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ScriptExecutionService } from '../services/script-execution.service';
import { ExecuteScriptDto } from '../dto/execute-script.dto';
import { ScriptExecution } from '../entities/script-execution.entity';

@ApiTags('Script Engine - Executions')
@Controller('script-engine/executions')
export class ExecutionController {
  constructor(private readonly executionService: ScriptExecutionService) {}

  @Post()
  @ApiOperation({ summary: 'Execute a script (sync or async)' })
  @ApiResponse({ status: 201, description: 'Execution started', type: ScriptExecution })
  async execute(@Body() dto: ExecuteScriptDto): Promise<ScriptExecution> {
    return this.executionService.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get execution details' })
  @ApiParam({ name: 'id', description: 'Execution UUID' })
  @ApiResponse({ status: 200, description: 'Execution details', type: ScriptExecution })
  async getById(@Param('id') id: string): Promise<ScriptExecution> {
    return this.executionService.getById(id);
  }

  @Get('script/:scriptId')
  @ApiOperation({ summary: 'Get all executions for a script' })
  @ApiParam({ name: 'scriptId', description: 'Script UUID' })
  @ApiResponse({ status: 200, description: 'List of executions', type: [ScriptExecution] })
  async findByScript(
    @Param('scriptId') scriptId: string,
    @Query('limit') limit?: string,
  ): Promise<ScriptExecution[]> {
    return this.executionService.findByScript(scriptId, limit ? parseInt(limit) : undefined);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a running execution' })
  @ApiParam({ name: 'id', description: 'Execution UUID' })
  @ApiResponse({ status: 200, description: 'Execution cancelled', type: ScriptExecution })
  async cancel(@Param('id') id: string): Promise<ScriptExecution> {
    return this.executionService.cancel(id);
  }

  @Get('script/:scriptId/stats')
  @ApiOperation({ summary: 'Get execution statistics for a script' })
  @ApiParam({ name: 'scriptId', description: 'Script UUID' })
  @ApiParam({ name: 'days', required: false })
  @ApiResponse({ status: 200, description: 'Execution statistics' })
  async getStats(
    @Param('scriptId') scriptId: string,
    @Query('days') days?: string,
  ): Promise<{
    total: number;
    completed: number;
    failed: number;
    avgExecutionTimeMs: number;
  }> {
    return this.executionService.getStats(scriptId, days ? parseInt(days) : undefined);
  }
}
