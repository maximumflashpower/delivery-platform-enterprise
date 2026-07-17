import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { DriverService } from '../services/driver.service';
import { Driver } from '../entities/driver.entity';

@Controller('drivers')
@ApiTags('Driver Operator - Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @ApiOperation({ summary: 'List all drivers' })
  @ApiResponse({ status: 200, type: [Driver] })
  async findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Driver })
  async findById(@Param('id') id: string) {
    return this.driverService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiBody({ type: Driver })
  @ApiResponse({ status: 201, type: Driver })
  async create(@Body() data: Partial<Driver>) {
    return this.driverService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update driver' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Driver })
  async update(@Param('id') id: string, @Body() data: Partial<Driver>) {
    return this.driverService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate driver (soft delete)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id') id: string) {
    await this.driverService.remove(id);
  }

  @Post(':id/verify-background')
  @ApiOperation({ summary: 'Verify driver background check' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { checkId: { type: 'string' }, expiryDate: { type: 'string', format: 'date' } } } })
  async verifyBackground(@Param('id') id: string, @Body() body: { checkId: string; expiryDate: string }) {
    const expiryDate = new Date(body.expiryDate);
    return this.driverService.verifyBackgroundCheck(id, body.checkId, expiryDate);
  }

  @Get('/stats')
  @ApiOperation({ summary: 'Get driver statistics' })
  async getStats() {
    return this.driverService.getStats();
  }
}
