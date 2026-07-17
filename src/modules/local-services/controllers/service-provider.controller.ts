import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ServiceProviderService } from '../services/service-provider.service';
import { ServiceProvider } from '../entities/service-provider.entity';

@Controller('service-providers')
@ApiTags('Local Services - Providers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ServiceProviderController {
  constructor(private readonly providerService: ServiceProviderService) {}

  @Get()
  @ApiOperation({ summary: 'List all service providers' })
  @ApiResponse({ status: 200, type: [ServiceProvider] })
  async findAll() {
    return this.providerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get provider by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ServiceProvider })
  async findById(@Param('id') id: string) {
    return this.providerService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new provider' })
  @ApiBody({ type: ServiceProvider })
  @ApiResponse({ status: 201, type: ServiceProvider })
  async create(@Body() data: Partial<ServiceProvider>) {
    return this.providerService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update provider' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ServiceProvider })
  async update(@Param('id') id: string, @Body() data: Partial<ServiceProvider>) {
    return this.providerService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate provider (soft delete)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id') id: string) {
    await this.providerService.remove(id);
  }

  @Post(':id/go-online')
  @ApiOperation({ summary: 'Set provider online' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async goOnline(@Param('id') id: string) {
    return this.providerService.goOnline(id);
  }

  @Post(':id/go-offline')
  @ApiOperation({ summary: 'Set provider offline' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async goOffline(@Param('id') id: string) {
    return this.providerService.goOffline(id);
  }
}
