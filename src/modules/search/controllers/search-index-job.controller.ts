import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { SearchIndexJobService } from '../services/search-index-job.service';
import { SearchIndexJob } from '../entities/search-index-job.entity';

@Controller('search-index-jobs')
@ApiTags('Search - Index Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class SearchIndexJobController {
  constructor(private readonly indexJobService: SearchIndexJobService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all index jobs' })
  @ApiResponse({ status: 200, type: [SearchIndexJob] })
  async findAll() { return this.indexJobService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get index job by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.indexJobService.findById(id); }

  @Post()
  @ApiOperation({ summary: 'Create index job' })
  @ApiBody({ type: SearchIndexJob })
  @ApiResponse({ status: 201, type: SearchIndexJob })
  async create(@Body() data: Partial<SearchIndexJob>) { return this.indexJobService.create(data); }

  @Post(':id/mark-indexing')
  @ApiOperation({ summary: 'Mark as indexing' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markIndexing(@Param('id') id: string) { return this.indexJobService.markIndexing(id); }

  @Post(':id/mark-indexed')
  @ApiOperation({ summary: 'Mark as indexed' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { indexedData: { type: 'object' } } } })
  async markIndexed(@Param('id') id: string, @Body() body?: { indexedData?: Record<string, any> }) { return this.indexJobService.markIndexed(id, body?.indexedData); }

  @Post(':id/mark-failed')
  @ApiOperation({ summary: 'Mark as failed' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { errorMessage: { type: 'string' } } } })
  async markFailed(@Param('id') id: string, @Body() body: { errorMessage: string }) { return this.indexJobService.markFailed(id, body.errorMessage); }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry index job' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async retry(@Param('id') id: string) { return this.indexJobService.retry(id); }
}
