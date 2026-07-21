import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ScriptTemplateService } from '../services/script-template.service';
import { CreateScriptTemplateDto } from '../dto/create-script-template.dto';
import { ScriptTemplate } from '../entities/script-template.entity';

@ApiTags('Script Engine - Templates')
@Controller('script-engine/templates')
export class TemplateController {
  constructor(private readonly templateService: ScriptTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new script template' })
  @ApiResponse({ status: 201, description: 'Template created', type: ScriptTemplate })
  async create(@Body() dto: CreateScriptTemplateDto): Promise<ScriptTemplate> {
    return this.templateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all templates' })
  @ApiResponse({ status: 200, description: 'List of templates', type: [ScriptTemplate] })
  async findAll(@Query('scriptId') scriptId?: string): Promise<ScriptTemplate[]> {
    return this.templateService.findAll(scriptId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template details' })
  @ApiParam({ name: 'id', description: 'Template UUID' })
  @ApiResponse({ status: 200, description: 'Template details', type: ScriptTemplate })
  async findOne(@Param('id') id: string): Promise<ScriptTemplate> {
    return this.templateService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update template' })
  @ApiParam({ name: 'id', description: 'Template UUID' })
  @ApiResponse({ status: 200, description: 'Template updated', type: ScriptTemplate })
  async update(@Param('id') id: string, @Body() partial: Partial<ScriptTemplate>): Promise<ScriptTemplate> {
    return this.templateService.update(id, partial);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete template' })
  @ApiParam({ name: 'id', description: 'Template UUID' })
  @ApiResponse({ status: 200, description: 'Template deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.templateService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate template' })
  @ApiParam({ name: 'id', description: 'Template UUID' })
  @ApiResponse({ status: 200, description: 'Template activated', type: ScriptTemplate })
  async activate(@Param('id') id: string): Promise<ScriptTemplate> {
    return this.templateService.activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate template' })
  @ApiParam({ name: 'id', description: 'Template UUID' })
  @ApiResponse({ status: 200, description: 'Template deactivated', type: ScriptTemplate })
  async deactivate(@Param('id') id: string): Promise<ScriptTemplate> {
    return this.templateService.deactivate(id);
  }
}
