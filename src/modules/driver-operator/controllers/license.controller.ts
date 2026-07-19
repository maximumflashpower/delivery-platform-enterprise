import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { LicenseService } from '../services/license.service';
import { License } from '../entities/license.entity';

@Controller('licenses')
@ApiTags('Driver Operator - Licenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all licenses' })
  @ApiResponse({ status: 200, type: [License] })
  async findAll() {
    return this.licenseService.findAll();
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'List licenses by driver ID' })
  @ApiParam({ name: 'driverId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [License] })
  async findByDriverId(@Param('driverId') driverId: string) {
    return this.licenseService.findByDriverId(driverId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get license by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) {
    return this.licenseService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create driver license' })
  @ApiBody({ type: License })
  @ApiResponse({ status: 201, type: License })
  async create(@Body() data: Partial<License>) {
    return this.licenseService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update license' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: License })
  async update(@Param('id') id: string, @Body() data: Partial<License>) {
    return this.licenseService.update(id, data);
  }

  @Post(':id/renew')
  @ApiOperation({ summary: 'Renew license' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { newExpiryDate: { type: 'string', format: 'date' } } } })
  async renew(@Param('id') id: string, @Body() body: { newExpiryDate: string }) {
    return this.licenseService.renew(id, new Date(body.newExpiryDate));
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend license' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async suspend(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.licenseService.suspend(id, body?.reason);
  }
}
