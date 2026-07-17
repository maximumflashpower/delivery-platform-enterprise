import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ClaimService } from '../services/claim.service';
import { Claim } from '../entities/claim.entity';
import { ClaimPriority } from '../enums/claim-priority.enum';

@Controller('claims')
@ApiTags('Support - Claims')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Get()
  @ApiOperation({ summary: 'List all claims' })
  @ApiResponse({ status: 200, type: [Claim] })
  async findAll() { return this.claimService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get claim by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.claimService.findById(id); }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List claims by user ID' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [Claim] })
  async findByUserId(@Param('userId') userId: string) { return this.claimService.findByUserId(userId); }

  @Post()
  @ApiOperation({ summary: 'Create claim' })
  @ApiBody({ type: Claim })
  @ApiResponse({ status: 201, type: Claim })
  async create(@Body() data: Partial<Claim>) { return this.claimService.create(data); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update claim' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Param('id') id: string, @Body() data: Partial<Claim>) { return this.claimService.update(id, data); }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign claim to user' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { userId: { type: 'string', format: 'uuid' } } } })
  async assignTo(@Param('id') id: string, @Body() body: { userId: string }) { return this.claimService.assignTo(id, body.userId); }

  @Post(':id/resolve')
  @ApiOperation({ summary: 'Resolve claim' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { resolutionNotes: { type: 'string' } } } })
  async resolve(@Param('id') id: string, @Body() body: { resolutionNotes: string }) { return this.claimService.resolve(id, body.resolutionNotes); }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close claim' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async close(@Param('id') id: string) { return this.claimService.close(id); }

  @Post(':id/reopen')
  @ApiOperation({ summary: 'Reopen claim' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async reopen(@Param('id') id: string) { return this.claimService.reopen(id); }

  @Post(':id/escalate')
  @ApiOperation({ summary: 'Escalate claim priority' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { newPriority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] } } } })
  async escalate(@Param('id') id: string, @Body() body: { newPriority: ClaimPriority }) { return this.claimService.escalate(id, body.newPriority); }
}
