import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ScriptService } from '../services/script.service';
import { CreateScriptDto } from '../dto/create-script.dto'
import { UpdateScriptDto } from '../dto/update-script.dto';
import { Script } from '../entities/script.entity';

@ApiTags('Script Engine - Scripts')
@Controller('api/script-engine/scripts')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new script' })
  @ApiResponse({ status: 201, description: 'Script created', type: Script })
  async create(@Body() dto: CreateScriptDto): Promise<Script> {
    return this.scriptService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all scripts' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiResponse({ status: 200, description: 'List of scripts', type: [Script] })
  async findAll(
    @Query('status') status?: string,
    @Query('language') language?: string,
  ): Promise<Script[]> {
    return this.scriptService.findAll({ status, language });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get script details' })
  @ApiParam({ name: 'id', description: 'Script UUID' })
  @ApiResponse({ status: 200, description: 'Script details', type: Script })
  async findOne(@Param('id') id: string): Promise<Script> {
    return this.scriptService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update script' })
  @ApiParam({ name: 'id', description: 'Script UUID' })
  @ApiResponse({ status: 200, description: 'Script updated', type: Script })
  async update(@Param('id') id: string, @Body() dto: UpdateScriptDto): Promise<Script> {
    return this.scriptService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete script' })
  @ApiParam({ name: 'id', description: 'Script UUID' })
  @ApiResponse({ status: 200, description: 'Script deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.scriptService.remove(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a draft script' })
  @ApiParam({ name: 'id', description: 'Script UUID' })
  @ApiResponse({ status: 200, description: 'Script published', type: Script })
  async publish(@Param('id') id: string): Promise<Script> {
    return this.scriptService.publish(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a script' })
  @ApiParam({ name: 'id', description: 'Script UUID' })
  @ApiResponse({ status: 200, description: 'Script deactivated', type: Script })
  async deactivate(@Param('id') id: string): Promise<Script> {
    return this.scriptService.deactivate(id);
  }

  @Get(':id/validate')
  @ApiOperation({ summary: 'Validate script syntax' })
  @ApiParam({ name: 'id', description: 'Script UUID' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validateSyntax(@Param('id') id: string): Promise<{ valid: boolean; errors: string[] }> {
    const script = await this.scriptService.findById(id);
    return this.scriptService.validateSyntax(script.sourceCode, script.language);
  }
}
