import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VehicleCapabilityService } from '../services/vehicle-capability.service';
import { Vehicle } from '../entities/vehicle.entity';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { VehicleType } from '../enums/vehicle-type.enum';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';

@ApiTags('vehicle-capability')
@Controller('vehicle-capability')
export class VehicleCapabilityController {
  constructor(private readonly service: VehicleCapabilityService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Register new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle registered successfully' })
  createVehicle(@Body() dto: {
    plateNumber: string;
    ownerId?: string;
    model: string;
    type: VehicleType;
    color?: string;
    capacity?: Record<string, number>;
  }) {
    return this.service.createVehicle(dto);
  }

  @PublicRoute()
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all vehicles (optional filters)' })
  @ApiResponse({ status: 200, description: 'Return list of vehicles' })
  findAllVehicles(
    @Query('type') type?: VehicleType,
    @Query('status') status?: VehicleStatus,
  ) {
    const conditions: Partial<any> = {};
    if (type) conditions.type = type;
    if (status) conditions.status = status;
    return this.service.findAllVehicles(Object.keys(conditions).length ? conditions : undefined);
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get vehicle statistics summary' })
  @ApiResponse({ status: 200, description: 'Return vehicle stats' })
  getVehicleStats() {
    return this.service.getVehicleStats();
  }

  @Get('available')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List only available vehicles' })
  @ApiResponse({ status: 200, description: 'Return available vehicles' })
  findAvailableVehicles() {
    return this.service.findAvailableVehicles();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Return vehicle details' })
  findVehicleById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findVehicleById(id);
  }

  @Get('plate/:plateNumber')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get vehicle by plate number' })
  @ApiResponse({ status: 200, description: 'Return vehicle details' })
  findVehicleByPlate(@Param('plateNumber') plateNumber: string) {
    return this.service.findVehicleByPlate(plateNumber);
  }

  @Get('owner/:ownerId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get vehicles by owner ID' })
  @ApiResponse({ status: 200, description: 'Return owner vehicles' })
  findVehiclesByOwner(@Param('ownerId', ParseUUIDPipe) ownerId: string) {
    return this.service.findVehiclesByOwner(ownerId);
  }

  @Get('type/:type')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get vehicles by type' })
  @ApiResponse({ status: 200, description: 'Return vehicles of specified type' })
  findVehiclesByType(@Param('type') type: VehicleType) {
    return this.service.findVehiclesByType(type);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update vehicle details' })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully' })
  updateVehicle(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<any>) {
    return this.service.updateVehicle(id, data);
  }

  @Put(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Set vehicle status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  setVehicleStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { status: VehicleStatus }) {
    return this.service.setVehicleStatus(id, dto.status);
  }

  @Post(':id/mark-busy')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mark vehicle as busy' })
  @ApiResponse({ status: 200, description: 'Vehicle marked as busy' })
  markAsBusy(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.markAsBusy(id);
  }

  @Post(':id/mark-available')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mark vehicle as available' })
  @ApiResponse({ status: 200, description: 'Vehicle marked as available' })
  markAsAvailable(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.markAsAvailable(id);
  }

  @Post(':id/maintenance')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Schedule maintenance for vehicle' })
  @ApiResponse({ status: 200, description: 'Maintenance scheduled' })
  scheduleMaintenance(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { reason?: string }) {
    return this.service.scheduleMaintenance(id, dto.reason);
  }

  @Post(':id/end-maintenance')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'End maintenance and mark as available' })
  @ApiResponse({ status: 200, description: 'Maintenance ended' })
  endMaintenance(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.endMaintenance(id);
  }

  @Put(':id/capacity')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update vehicle capacity configuration' })
  @ApiResponse({ status: 200, description: 'Capacity updated successfully' })
  updateCapacity(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { capacity: Record<string, number> }) {
    return this.service.updateCapacity(id, dto.capacity);
  }
}
