import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { CourierAssignmentService } from '../services/courier-assignment.service';
import { CourierAssignment } from '../entities/courier-assignment.entity';

@Controller('courier-assignments')
@ApiTags('Delivery - Assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class CourierAssignmentController {
  constructor(private readonly assignmentService: CourierAssignmentService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all courier assignments' })
  @ApiResponse({ status: 200, type: [CourierAssignment] })
  async findAll() {
    return this.assignmentService.findAll();
  }

  @Get('courier/:courierId')
  @ApiOperation({ summary: 'List assignments by courier ID' })
  @ApiParam({ name: 'courierId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [CourierAssignment] })
  async findByCourierId(@Param('courierId') courierId: string) {
    return this.assignmentService.findByCouriertId(courierId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) {
    return this.assignmentService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create courier assignment' })
  @ApiBody({ type: CourierAssignment })
  @ApiResponse({ status: 201, type: CourierAssignment })
  async create(@Body() data: Partial<CourierAssignment>) {
    return this.assignmentService.create(data);
  }

  @Post(':id/mark-assigned')
  @ApiOperation({ summary: 'Mark assignment as assigned' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markAssigned(@Param('id') id: string) {
    return this.assignmentService.markAssigned(id);
  }

  @Post(':id/mark-completed')
  @ApiOperation({ summary: 'Mark assignment as completed' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markCompleted(@Param('id') id: string) {
    return this.assignmentService.markCompleted(id);
  }

  @Post(':id/mark-failed')
  @ApiOperation({ summary: 'Mark assignment as failed' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markFailed(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.assignmentService.markFailed(id, body?.reason);
  }
}
