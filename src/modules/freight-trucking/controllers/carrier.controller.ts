import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { CarrierService } from '../services/carrier.service';
import { Carrier } from '../entities/carrier.entity';

@Controller('carriers')
@ApiTags('Freight Trucking - Carriers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class CarrierController {
  constructor(private readonly carrierService: CarrierService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all carriers' })
  @ApiResponse({ status: 200, type: [Carrier] })
  async findAll() { return this.carrierService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get carrier by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.carrierService.findById(id); }

  @Post()
  @ApiOperation({ summary: 'Create a new carrier' })
  @ApiBody({ type: Carrier })
  async create(@Body() data: Partial<Carrier>) { return this.carrierService.create(data); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update carrier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Param('id') id: string, @Body() data: Partial<Carrier>) { return this.carrierService.update(id, data); }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate carrier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id') id: string) { await this.carrierService.remove(id); }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate carrier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async activate(@Param('id') id: string) { return this.carrierService.activate(id); }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend carrier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async suspend(@Param('id') id: string) { return this.carrierService.suspend(id); }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify carrier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async verify(@Param('id') id: string) { return this.carrierService.verify(id); }
}
