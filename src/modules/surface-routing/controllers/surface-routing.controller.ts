import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SurfaceRoutingService } from '../services/surface-routing.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';

@ApiTags('surface-routing')
@Controller('surface-routing')
export class SurfaceRoutingController {
  constructor(private readonly service: SurfaceRoutingService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new route' })
  @ApiResponse({ status: 201, description: 'Route created successfully' })
  createRoute(@Body() dto: {
    routeId: string;
    waypoints: Array<{ lat: number; lng: number; order: number }>;
    distanceKm?: number;
    estimatedDurationSeconds?: number;
    optimizationMode?: string;
  }) {
    return this.service.createRoute(dto);
  }

  @PublicRoute()
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all routes (optional filter by optimization mode)' })
  @ApiResponse({ status: 200, description: 'Return list of routes' })
  findAllRoutes(@Query('optimizationMode') optimizationMode?: string) {
    return this.service.findAllRoutes(optimizationMode ? { optimizationMode } : undefined);
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get route statistics summary' })
  @ApiResponse({ status: 200, description: 'Return route stats' })
  getRouteStats() {
    return this.service.getRouteStats();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiResponse({ status: 200, description: 'Return route details' })
  findRouteById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findRouteById(id);
  }

  @Get('ref/:routeId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get route by route reference ID' })
  @ApiResponse({ status: 200, description: 'Return route details' })
  findRouteByRouteId(@Param('routeId') routeId: string) {
    return this.service.findRouteByRouteId(routeId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update route details' })
  @ApiResponse({ status: 200, description: 'Route updated successfully' })
  updateRoute(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<any>) {
    return this.service.updateRoute(id, data);
  }

  @Post(':id/waypoints')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add waypoint to route' })
  @ApiResponse({ status: 200, description: 'Waypoint added successfully' })
  addWaypoint(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { lat: number; lng: number; order: number }) {
    return this.service.addWaypoint(id, dto);
  }

  @Delete(':id/waypoints/:order')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove waypoint from route by order' })
  @ApiResponse({ status: 200, description: 'Waypoint removed successfully' })
  removeWaypoint(@Param('id', ParseUUIDPipe) id: string, @Param('order') order: string) {
    return this.service.removeWaypoint(id, parseInt(order, 10));
  }

  @Put(':id/reorder')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reorder waypoints in route' })
  @ApiResponse({ status: 200, description: 'Waypoints reordered successfully' })
  reorderWaypoints(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { waypoints: Array<{ order: number; lat: number; lng: number }> }) {
    return this.service.reorderWaypoints(id, dto.waypoints);
  }

  @Post(':id/optimize')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Optimize route waypoints (nearest neighbor heuristic)' })
  @ApiResponse({ status: 200, description: 'Route optimized successfully' })
  optimizeRoute(@Param('id', ParseUUIDPipe) id: string, @Body() dto: { mode: string }) {
    return this.service.optimizeRoute(id, dto.mode);
  }

  @Get(':id/distance')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Calculate total distance of route (haversine)' })
  @ApiResponse({ status: 200, description: 'Return distance calculation' })
  calculateDistance(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.calculateDistance(id);
  }
}
