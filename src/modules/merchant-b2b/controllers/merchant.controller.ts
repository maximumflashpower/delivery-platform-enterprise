import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { MerchantService } from '../services/merchant.service';
import { Merchant } from '../entities/merchant.entity';
import { TierLevel } from '../enums/tier-level.enum';

@Controller('merchants')
@ApiTags('Merchant B2B - Merchants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all merchants' })
  @ApiResponse({ status: 200, type: [Merchant] })
  async findAll() {
    return this.merchantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Merchant })
  async findById(@Param('id') id: string) {
    return this.merchantService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new merchant' })
  @ApiBody({ type: Merchant })
  @ApiResponse({ status: 201, type: Merchant })
  async create(@Body() data: Partial<Merchant>) {
    return this.merchantService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update merchant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Merchant })
  async update(@Param('id') id: string, @Body() data: Partial<Merchant>) {
    return this.merchantService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate merchant (soft delete)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Param('id') id: string) {
    await this.merchantService.remove(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve merchant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async approve(@Param('id') id: string) {
    return this.merchantService.approve(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject merchant' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async reject(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.merchantService.reject(id, body?.reason);
  }

  @Post(':id/upgrade-tier')
  @ApiOperation({ summary: 'Upgrade merchant tier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { tier: { type: 'string', enum: ['bronze', 'silver', 'gold', 'platinum'] } } } })
  async upgradeTier(@Param('id') id: string, @Body() body: { tier: TierLevel }) {
    return this.merchantService.upgradeTier(id, body.tier);
  }

  @Get('/stats')
  @ApiOperation({ summary: 'Get merchant statistics' })
  async getStats() {
    return this.merchantService.getStats();
  }
}
