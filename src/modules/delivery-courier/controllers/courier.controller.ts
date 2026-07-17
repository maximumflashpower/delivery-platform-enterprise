import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { CourierService } from '../services/courier.service';
import { Courier } from '../entities/courier.entity';

@Controller('couriers')
@ApiTags('Delivery - Couriers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @Get()
  @ApiOperation({ summary: 'List all couriers' })
  @ApiResponse({ status: 200, type: [Courier] })
  async findAll() {
    return this.courierService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get courier by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Courier })
  @ApiResponse({ status: 404, description: 'Courier not found' })
  async findById(@Param('id') id: string) {
    return this.courierService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new courier' })
  @ApiBody({ type: Courier })
  @ApiResponse({ status: 201, type: Courier })
  async create(@Body() data: Partial<Courier>) {
    return this.courierService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update courier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Courier })
  async update(@Param('id') id: string, @Body() data: Partial<Courier>) {
    return this.courierService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate courier (soft delete)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id') id: string) {
    await this.courierService.remove(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate courier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async activate(@Param('id') id: string) {
    return this.courierService.activate(id);
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate courier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async deactivate(@Param('id') id: string, @Body() reason?: { reason?: string }) {
    return this.courierService.deactivate(id, reason?.reason);
  }

  @Get('/stats')
  @ApiOperation({ summary: 'Get courier statistics' })
  async getStats() {
    return this.courierService.getStats();
  }
}
