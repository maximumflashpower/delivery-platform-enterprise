import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ShipmentService } from '../services/shipment.service';
import { Shipment } from '../entities/shipment.entity';

@Controller('shipments')
@ApiTags('Freight Trucking - Shipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all shipments' })
  @ApiResponse({ status: 200, type: [Shipment] })
  async findAll() { return this.shipmentService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipment by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.shipmentService.findById(id); }

  @Get('carrier/:carrierId')
  @ApiOperation({ summary: 'List shipments by carrier ID' })
  @ApiParam({ name: 'carrierId', format: 'uuid' })
  async findByCarrierId(@Param('carrierId') carrierId: string) { return this.shipmentService.findByCarrierId(carrierId); }

  @Post()
  @ApiOperation({ summary: 'Create shipment' })
  @ApiBody({ type: Shipment })
  @ApiResponse({ status: 201, type: Shipment })
  async create(@Body() data: Partial<Shipment>) { return this.shipmentService.create(data); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shipment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Param('id') id: string, @Body() data: Partial<Shipment>) { return this.shipmentService.update(id, data); }

  @Post(':id/mark-picked-up')
  @ApiOperation({ summary: 'Mark as picked up' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markPickedUp(@Param('id') id: string) { return this.shipmentService.markPickedUp(id); }

  @Post(':id/mark-in-transit')
  @ApiOperation({ summary: 'Mark as in transit' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markInTransit(@Param('id') id: string) { return this.shipmentService.markInTransit(id); }

  @Post(':id/mark-out-for-delivery')
  @ApiOperation({ summary: 'Mark as out for delivery' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markOutForDelivery(@Param('id') id: string) { return this.shipmentService.markOutForDelivery(id); }

  @Post(':id/mark-delivered')
  @ApiOperation({ summary: 'Mark as delivered' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markDelivered(@Param('id') id: string) { return this.shipmentService.markDelivered(id); }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel shipment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancel(@Param('id') id: string) { return this.shipmentService.cancel(id); }

  @Post(':id/mark-returned')
  @ApiOperation({ summary: 'Mark as returned' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markReturned(@Param('id') id: string) { return this.shipmentService.markReturned(id); }
}
