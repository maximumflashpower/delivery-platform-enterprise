import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { SlaConfigService } from '../services/sla-config.service';
import { SlaConfig } from '../entities/sla-config.entity';

@Controller('sla-configs')
@ApiTags('Support - SLA Configs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class SlaConfigController {
  constructor(private readonly slaConfigService: SlaConfigService) {}

  @Get()
  @ApiOperation({ summary: 'List all SLA configs' })
  @ApiResponse({ status: 200, type: [SlaConfig] })
  async findAll() { return this.slaConfigService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get SLA config by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.slaConfigService.findById(id); }

  @Post()
  @ApiOperation({ summary: 'Create SLA config' })
  @ApiBody({ type: SlaConfig })
  @ApiResponse({ status: 201, type: SlaConfig })
  async create(@Body() data: Partial<SlaConfig>) { return this.slaConfigService.create(data); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update SLA config' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Param('id') id: string, @Body() data: Partial<SlaConfig>) { return this.slaConfigService.update(id, data); }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate SLA config' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async activate(@Param('id') id: string) { return this.slaConfigService.activate(id); }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate SLA config' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async deactivate(@Param('id') id: string) { return this.slaConfigService.deactivate(id); }
}
