import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ScheduleService } from '../services/schedule.service';
import { Schedule } from '../entities/schedule.entity';

@Controller('schedules')
@ApiTags('Scheduling - Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'List all schedules' })
  @ApiResponse({ status: 200, type: [Schedule] })
  async findAll() { return this.scheduleService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.scheduleService.findById(id); }

  @Post()
  @ApiOperation({ summary: 'Create schedule' })
  @ApiBody({ type: Schedule })
  @ApiResponse({ status: 201, type: Schedule })
  async create(@Body() data: Partial<Schedule>) { return this.scheduleService.create(data); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update schedule' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Param('id') id: string, @Body() data: Partial<Schedule>) { return this.scheduleService.update(id, data); }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate schedule' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async activate(@Param('id') id: string) { return this.scheduleService.activate(id); }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate schedule' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async deactivate(@Param('id') id: string) { return this.scheduleService.deactivate(id); }

  @Post(':id/mark-run')
  @ApiOperation({ summary: 'Mark schedule as run' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { nextRunAt: { type: 'string', format: 'date-time' } } } })
  async markRun(@Param('id') id: string, @Body() body: { nextRunAt: string }) { return this.scheduleService.markRun(id, new Date(body.nextRunAt)); }
}
