import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { HostService } from '../services/host.service';
import { Host } from '../entities/host.entity';

@Controller('hosts')
@ApiTags('Host Travel - Hosts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Get()
  @ApiOperation({ summary: 'List all hosts' })
  @ApiResponse({ status: 200, type: [Host] })
  async findAll() {
    return this.hostService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get host by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Host })
  async findById(@Param('id') id: string) {
    return this.hostService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new host' })
  @ApiBody({ type: Host })
  @ApiResponse({ status: 201, type: Host })
  async create(@Body() data: Partial<Host>) {
    return this.hostService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update host' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Host })
  async update(@Param('id') id: string, @Body() data: Partial<Host>) {
    return this.hostService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate host (soft delete)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id') id: string) {
    await this.hostService.remove(id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify host' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async verify(@Param('id') id: string) {
    return this.hostService.verify(id);
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend host' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async suspend(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.hostService.suspend(id, body?.reason);
  }

  @Post(':id/toggle-superhost')
  @ApiOperation({ summary: 'Toggle super host status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { isSuperHost: { type: 'boolean' } } } })
  async toggleSuperHost(@Param('id') id: string, @Body() body: { isSuperHost: boolean }) {
    return this.hostService.toggleSuperHost(id, body.isSuperHost);
  }
}
