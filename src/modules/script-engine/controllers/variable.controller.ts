import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ScriptVariableService } from '../services/script-variable.service';
import { CreateScriptVariableDto } from '../dto/create-script-variable.dto';
import { ScriptVariable } from '../entities/script-variable.entity';

@ApiTags('Script Engine - Variables')
@Controller('api/script-engine/variables')
export class VariableController {
  constructor(private readonly variableService: ScriptVariableService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new script variable' })
  @ApiResponse({ status: 201, description: 'Variable created', type: ScriptVariable })
  async create(@Body() dto: CreateScriptVariableDto): Promise<ScriptVariable> {
    return this.variableService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List variables for a script' })
  @ApiParam({ name: 'scriptId', required: true })
  @ApiQuery({ name: 'includeSecrets', required: false })
  @ApiResponse({ status: 200, description: 'List of variables', type: [ScriptVariable] })
  async findByScript(
    @Query('scriptId') scriptId: string,
    @Query('includeSecrets') includeSecrets?: string,
  ): Promise<ScriptVariable[]> {
    return this.variableService.findByScript(scriptId, includeSecrets === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get variable details' })
  @ApiParam({ name: 'id', description: 'Variable UUID' })
  @ApiResponse({ status: 200, description: 'Variable details', type: ScriptVariable })
  async findOne(@Param('id') id: string): Promise<ScriptVariable> {
    return this.variableService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update variable' })
  @ApiParam({ name: 'id', description: 'Variable UUID' })
  @ApiResponse({ status: 200, description: 'Variable updated', type: ScriptVariable })
  async update(@Param('id') id: string, @Body() partial: Partial<ScriptVariable>): Promise<ScriptVariable> {
    return this.variableService.update(id, partial);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete variable' })
  @ApiParam({ name: 'id', description: 'Variable UUID' })
  @ApiResponse({ status: 200, description: 'Variable deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.variableService.remove(id);
  }
}
