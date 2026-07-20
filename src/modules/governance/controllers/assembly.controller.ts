import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AssemblyService } from '../services/assembly.service';
import { CreateAssemblyDto, UpdateAssemblyDto } from '../dto/create-assembly.dto';
import { Assembly } from '../entities/assembly.entity';

@ApiTags('Governance - Assemblies')
@Controller('api/governance/assemblies')
export class AssemblyController {
  constructor(private readonly assemblyService: AssemblyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new assembly' })
  @ApiResponse({ status: 201, description: 'Assembly created', type: Assembly })
  async create(@Body() dto: CreateAssemblyDto): Promise<Assembly> {
    return this.assemblyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all assemblies' })
  @ApiQuery({ name: 'communityId', required: false })
  @ApiResponse({ status: 200, description: 'List of assemblies', type: [Assembly] })
  async findAll(@Query('communityId') communityId?: string): Promise<Assembly[]> {
    return this.assemblyService.findAll(communityId ? { communityId } : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assembly details' })
  @ApiParam({ name: 'id', description: 'Assembly UUID' })
  @ApiResponse({ status: 200, description: 'Assembly details', type: Assembly })
  async findOne(@Param('id') id: string): Promise<Assembly> {
    return this.assemblyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assembly' })
  @ApiParam({ name: 'id', description: 'Assembly UUID' })
  @ApiResponse({ status: 200, description: 'Assembly updated', type: Assembly })
  async update(@Param('id') id: string, @Body() dto: UpdateAssemblyDto): Promise<Assembly> {
    return this.assemblyService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete assembly' })
  @ApiParam({ name: 'id', description: 'Assembly UUID' })
  @ApiResponse({ status: 200, description: 'Assembly deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.assemblyService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate scheduled assembly' })
  @ApiParam({ name: 'id', description: 'Assembly UUID' })
  @ApiResponse({ status: 200, description: 'Assembly activated', type: Assembly })
  async activate(@Param('id') id: string): Promise<Assembly> {
    return this.assemblyService.activate(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete active assembly' })
  @ApiParam({ name: 'id', description: 'Assembly UUID' })
  @ApiResponse({ status: 200, description: 'Assembly completed', type: Assembly })
  async complete(@Param('id') id: string): Promise<Assembly> {
    return this.assemblyService.complete(id);
  }

  @Get(':id/quorum-check')
  @ApiOperation({ summary: 'Check quorum status' })
  @ApiParam({ name: 'id', description: 'Assembly UUID' })
  @ApiResponse({ status: 200, description: 'Quorum status' })
  async checkQuorum(@Param('id') id: string): Promise<{ met: boolean; current: number; required: number }> {
    return this.assemblyService.checkQuorum(id);
  }
}
