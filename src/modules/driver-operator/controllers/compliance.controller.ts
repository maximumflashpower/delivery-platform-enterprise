import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ComplianceService } from '../services/compliance.service';
import { Compliance } from '../entities/compliance.entity';

@Controller('compliance')
@ApiTags('Driver Operator - Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get()
  @ApiOperation({ summary: 'List all compliance records' })
  @ApiResponse({ status: 200, type: [Compliance] })
  async findAll() {
    return this.complianceService.findAll();
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'List compliance by driver ID' })
  @ApiParam({ name: 'driverId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [Compliance] })
  async findByDriverId(@Param('driverId') driverId: string) {
    return this.complianceService.findByDriverId(driverId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get compliance record by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) {
    return this.complianceService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create compliance record' })
  @ApiBody({ type: Compliance })
  @ApiResponse({ status: 201, type: Compliance })
  async create(@Body() data: Partial<Compliance>) {
    return this.complianceService.create(data);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify compliance' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async verify(@Param('id') id: string) {
    return this.complianceService.verify(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject compliance' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async reject(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.complianceService.reject(id, body?.reason);
  }

  @Post(':id/request-review')
  @ApiOperation({ summary: 'Request review for compliance' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async requestReview(@Param('id') id: string) {
    return this.complianceService.requestReview(id);
  }
}
