import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ClaimTicketService } from '../services/claim-ticket.service';
import { ClaimTicket } from '../entities/claim-ticket.entity';

@Controller('claim-tickets')
@ApiTags('Support - Claim Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ClaimTicketController {
  constructor(private readonly ticketService: ClaimTicketService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all claim tickets' })
  @ApiResponse({ status: 200, type: [ClaimTicket] })
  async findAll() { return this.ticketService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.ticketService.findById(id); }

  @Get('claim/:claimId')
  @ApiOperation({ summary: 'List tickets by claim ID' })
  @ApiParam({ name: 'claimId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [ClaimTicket] })
  async findByClaimId(@Param('claimId') claimId: string) { return this.ticketService.findByClaimId(claimId); }

  @Post()
  @ApiOperation({ summary: 'Create ticket' })
  @ApiBody({ type: ClaimTicket })
  @ApiResponse({ status: 201, type: ClaimTicket })
  async create(@Body() data: Partial<ClaimTicket>) { return this.ticketService.create(data); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ticket' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Param('id') id: string, @Body() data: Partial<ClaimTicket>) { return this.ticketService.update(id, data); }
}
