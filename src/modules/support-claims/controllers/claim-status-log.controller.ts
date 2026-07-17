import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ClaimStatusLogService } from '../services/claim-status-log.service';
import { ClaimStatusLog } from '../entities/claim-status-log.entity';

@Controller('claim-status-logs')
@ApiTags('Support - Claim Status Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ClaimStatusLogController {
  constructor(private readonly statusLogService: ClaimStatusLogService) {}

  @Get()
  @ApiOperation({ summary: 'List all status logs' })
  @ApiResponse({ status: 200, type: [ClaimStatusLog] })
  async findAll() { return this.statusLogService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get status log by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.statusLogService.findById(id); }

  @Get('claim/:claimId')
  @ApiOperation({ summary: 'List status logs by claim ID' })
  @ApiParam({ name: 'claimId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [ClaimStatusLog] })
  async findByClaimId(@Param('claimId') claimId: string) { return this.statusLogService.findByClaimId(claimId); }

  @Post()
  @ApiOperation({ summary: 'Create status log' })
  @ApiBody({ type: ClaimStatusLog })
  @ApiResponse({ status: 201, type: ClaimStatusLog })
  async create(@Body() data: Partial<ClaimStatusLog>) { return this.statusLogService.create(data); }
}
