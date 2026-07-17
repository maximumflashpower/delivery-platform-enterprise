import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { JobService } from '../services/job.service';
import { Job } from '../entities/job.entity';

@Controller('jobs')
@ApiTags('Scheduling - Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @ApiOperation({ summary: 'List all jobs' })
  @ApiResponse({ status: 200, type: [Job] })
  async findAll() { return this.jobService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.jobService.findById(id); }

  @Post()
  @ApiOperation({ summary: 'Create job' })
  @ApiBody({ type: Job })
  @ApiResponse({ status: 201, type: Job })
  async create(@Body() data: Partial<Job>) { return this.jobService.create(data); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update job' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Param('id') id: string, @Body() data: Partial<Job>) { return this.jobService.update(id, data); }

  @Post(':id/queue')
  @ApiOperation({ summary: 'Queue job' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async queue(@Param('id') id: string) { return this.jobService.queue(id); }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start job' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async start(@Param('id') id: string) { return this.jobService.start(id); }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete job' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async complete(@Param('id') id: string) { return this.jobService.complete(id); }

  @Post(':id/fail')
  @ApiOperation({ summary: 'Fail job' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { errorMessage: { type: 'string' } } } })
  async fail(@Param('id') id: string, @Body() body: { errorMessage: string }) { return this.jobService.fail(id, body.errorMessage); }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry job' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async retry(@Param('id') id: string) { return this.jobService.retry(id); }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel job' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancel(@Param('id') id: string) { return this.jobService.cancel(id); }
}
