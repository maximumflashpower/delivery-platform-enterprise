import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { HaulerService } from '../services/hauler.service';
import { Hauler } from '../entities/hauler.entity';

@Controller('haulers')
@ApiTags('Hauling Moving - Haulers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class HaulerController {
  constructor(private readonly haulerService: HaulerService) {}

  @Get()
  @ApiOperation({ summary: 'List all haulers' })
  @ApiResponse({ status: 200, type: [Hauler] })
  async findAll() {
    return this.haulerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hauler by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Hauler })
  async findById(@Param('id') id: string) {
    return this.haulerService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new hauler' })
  @ApiBody({ type: Hauler })
  @ApiResponse({ status: 201, type: Hauler })
  async create(@Body() data: Partial<Hauler>) {
    return this.haulerService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hauler' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Hauler })
  async update(@Param('id') id: string, @Body() data: Partial<Hauler>) {
    return this.haulerService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate hauler (soft delete)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id') id: string) {
    await this.haulerService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate hauler' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async activate(@Param('id') id: string) {
    return this.haulerService.activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate hauler' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async deactivate(@Param('id') id: string) {
    return this.haulerService.deactivate(id);
  }
}
