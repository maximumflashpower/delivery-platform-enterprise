import {
  Controller, Get, Post, Put, Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MobilityRideService } from '../services/mobility-ride.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RideStatus } from '../enums/ride-status.enum';
import { RideType } from '../enums/ride-type.enum';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';

@ApiTags('mobility-ride')
@Controller('mobility-ride')
export class MobilityRideController {
  constructor(private readonly service: MobilityRideService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new ride request' })
  @ApiResponse({ status: 201, description: 'Ride created successfully' })
  createRide(@Body() dto: {
    rideId: string;
    passengerId?: string;
    type: RideType;
    locations?: Record<string, { lat: number; lng: number; address: string }>;
  }) {
    return this.service.createRide(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all rides (optional filters)' })
  @ApiResponse({ status: 200, description: 'Return list of rides' })
  findAllRides(
    @Query('status') status?: RideStatus,
    @Query('passengerId') passengerId?: string,
    @Query('driverId') driverId?: string,
  ) {
    const conditions: any = {};
    if (status) conditions.status = status;
    if (passengerId) conditions.passengerId = passengerId;
    if (driverId) conditions.driverId = driverId;
    return this.service.findAllRides(Object.keys(conditions).length ? conditions : undefined);
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get ride statistics summary' })
  @ApiResponse({ status: 200, description: 'Return ride stats' })
  getRideStats(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.service.getRideStats(startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
  }

  @Get('active')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List only active rides' })
  @ApiResponse({ status: 200, description: 'Return active rides' })
  findActiveRides() {
    return this.service.findActiveRides();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get ride by ID' })
  @ApiResponse({ status: 200, description: 'Return ride details' })
  findRideById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findRideById(id);
  }

  @Get('ref/:rideId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get ride by ride reference ID' })
  @ApiResponse({ status: 200, description: 'Return ride details' })
  findRideByRideId(@Param('rideId') rideId: string) {
    return this.service.findRideByRideId(rideId);
  }

  @Get('passenger/:passengerId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get rides by passenger ID' })
  @ApiResponse({ status: 200, description: 'Return passenger rides' })
  findRidesByPassenger(@Param('passengerId', ParseUUIDPipe) passengerId: string) {
    return this.service.findRidesByPassenger(passengerId);
  }

  @Get('driver/:driverId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get rides by driver ID' })
  @ApiResponse({ status: 200, description: 'Return driver rides' })
  findRidesByDriver(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.service.findRidesByDriver(driverId);
  }

  @Get('type/:type')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get rides by type' })
  @ApiResponse({ status: 200, description: 'Return rides of specified type' })
  findRidesByType(@Param('type') type: RideType) {
    return this.service.findRidesByStatus(type as unknown as RideStatus);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update ride details' })
  @ApiResponse({ status: 200, description: 'Ride updated successfully' })
  updateRide(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<any>) {
    return this.service.updateRide(id, data);
  }

  @Post('estimate-fare')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Calculate estimated fare for ride parameters' })
  @ApiResponse({ status: 200, description: 'Return estimated fare' })
  estimateFare(@Body() dto: { type: RideType; distanceKm: number; durationMin: number }) {
    return this.service.calculateEstimatedFare(dto.type, dto.distanceKm, dto.durationMin);
  }

  @Post(':id/accept')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Accept ride request (assign driver)' })
  @ApiResponse({ status: 200, description: 'Ride accepted' })
  acceptRide(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { driverId: string }) {
    return this.service.acceptRide(id, dto.driverId);
  }

  @Post(':id/start')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Start ride (mark as in progress)' })
  @ApiResponse({ status: 200, description: 'Ride started' })
  startRide(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.startRide(id);
  }

  @Post(':id/complete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Complete ride and set fare' })
  @ApiResponse({ status: 200, description: 'Ride completed' })
  completeRide(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { fare?: number; locations?: Record<string, { lat: number; lng: number; address: string }> }) {
    return this.service.completeRide(id, dto.fare, dto.locations);
  }

  @Post(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cancel ride' })
  @ApiResponse({ status: 200, description: 'Ride cancelled' })
  cancelRide(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { reason?: string }) {
    return this.service.cancelRide(id, dto.reason);
  }

  @Post(':id/no-show')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mark ride as no-show' })
  @ApiResponse({ status: 200, description: 'Ride marked as no-show' })
  markNoShow(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.markNoShow(id);
  }

  @Post(':id/assign-driver')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assign driver to requested ride' })
  @ApiResponse({ status: 200, description: 'Driver assigned' })
  assignDriver(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { driverId: string }) {
    return this.service.assignDriver(id, dto.driverId);
  }

  @Put(':id/fare')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update ride fare' })
  @ApiResponse({ status: 200, description: 'Fare updated' })
  updateFare(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { fare: number }) {
    return this.service.updateFare(id, dto.fare);
  }

  @Put(':id/locations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update ride locations' })
  @ApiResponse({ status: 200, description: 'Locations updated' })
  updateLocations(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { locations: Record<string, { lat: number; lng: number; address: string }> }) {
    return this.service.updateLocations(id, dto.locations);
  }
}
