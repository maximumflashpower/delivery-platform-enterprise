import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { LoadService } from '../services/load.service';
import { Load } from '../entities/load.entity';

@Controller('loads')
@ApiTags('Hauling Moving - Loads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class LoadController {
  constructor(private readonly loadService: LoadService) {}

  @Get()
  @ApiOperation({ summary: 'List all loads' })
  @ApiResponse({ status: 200, type: [Load] })
  async findAll() {
    return this.loadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get load by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Load })
  async findById(@Param('id') id: string) {
    return this.loadService.findById(id);
  }

  @Get('hauler/:haulerId')
  @ApiOperation({ summary: 'List loads by hauler ID' })
  @ApiParam({ name: 'haulerId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [Load] })
  async findByHaulerId(@Param('haulerId') haulerId: string) {
    return this.loadService.findByHaulerId(haulerId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new load' })
  @ApiBody({ type: Load })
  @ApiResponse({ status: 201, type: Load })
  async create(@Body() data: Partial<Load>) {
    return this.loadService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update load' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Load })
  async update(@Param('id') id: string, @Body() data: Partial<Load>) {
    return this.loadService.update(id, data);
  }

  @Post(':id/mark-pickup-pending')
  @ApiOperation({ summary: 'Mark load as pickup pending' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markPickupPending(@Param('id') id: string) {
    return this.loadService.markPickupPending(id);
  }

  @Post(':id/mark-in-transit')
  @ApiOperation({ summary: 'Mark load as in transit' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markInTransit(@Param('id') id: string) {
    return this.loadService.markInTransit(id);
  }

  @Post(':id/mark-delivered')
  @ApiOperation({ summary: 'Mark load as delivered' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markDelivered(@Param('id') id: string) {
    return this.loadService.markDelivered(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel load' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancel(@Param('id') id: string) {
    return this.loadService.cancel(id);
  }
}
