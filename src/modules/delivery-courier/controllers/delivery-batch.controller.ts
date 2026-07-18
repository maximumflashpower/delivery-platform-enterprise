import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { DeliveryBatchService } from '../services/delivery-batch.service';
import { DeliveryBatch } from '../entities/delivery-batch.entity';

@Controller('delivery-batches')
@ApiTags('Delivery - Batches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class DeliveryBatchController {
  constructor(private readonly batchService: DeliveryBatchService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all delivery batches' })
  @ApiResponse({ status: 200, type: [DeliveryBatch] })
  async findAll() {
    return this.batchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery batch by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: DeliveryBatch })
  async findById(@Param('id') id: string) {
    return this.batchService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create delivery batch' })
  @ApiBody({ type: DeliveryBatch })
  @ApiResponse({ status: 201, type: DeliveryBatch })
  async create(@Body() data: Partial<DeliveryBatch>) {
    return this.batchService.create(data);
  }

  @Post(':id/assign-courier')
  @ApiOperation({ summary: 'Assign courier to batch' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { courierId: { type: 'string', format: 'uuid' } } } })
  async assignCourier(@Param('id') id: string, @Body() body: { courierId: string }) {
    return this.batchService.assignCourier(id, body.courierId);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start delivery batch' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async start(@Param('id') id: string) {
    return this.batchService.startBatch(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete delivery batch' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async complete(@Param('id') id: string) {
    return this.batchService.completeBatch(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel delivery batch' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancel(@Param('id') id: string) {
    return this.batchService.cancelBatch(id);
  }
}
