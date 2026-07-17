import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { MovingRequestService } from '../services/moving-request.service';
import { MovingRequest } from '../entities/moving-request.entity';

@Controller('moving-requests')
@ApiTags('Hauling Moving - Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class MovingRequestController {
  constructor(private readonly requestService: MovingRequestService) {}

  @Get()
  @ApiOperation({ summary: 'List all moving requests' })
  @ApiResponse({ status: 200, type: [MovingRequest] })
  async findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: MovingRequest })
  async findById(@Param('id') id: string) {
    return this.requestService.findById(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'List requests by customer ID' })
  @ApiParam({ name: 'customerId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [MovingRequest] })
  async findByCustomerId(@Param('customerId') customerId: string) {
    return this.requestService.findByCustomerId(customerId);
  }

  @Post()
  @ApiOperation({ summary: 'Create moving request' })
  @ApiBody({ type: MovingRequest })
  @ApiResponse({ status: 201, type: MovingRequest })
  async create(@Body() data: Partial<MovingRequest>) {
    return this.requestService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update request' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: MovingRequest })
  async update(@Param('id') id: string, @Body() data: Partial<MovingRequest>) {
    return this.requestService.update(id, data);
  }

  @Post(':id/assign-hauler')
  @ApiOperation({ summary: 'Assign hauler to request' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { haulerId: { type: 'string', format: 'uuid' } } } })
  async assignHauler(@Param('id') id: string, @Body() body: { haulerId: string }) {
    return this.requestService.assignHauler(id, body.haulerId);
  }

  @Post(':id/accept-quote')
  @ApiOperation({ summary: 'Accept quote' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async acceptQuote(@Param('id') id: string) {
    return this.requestService.acceptQuote(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel request' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancel(@Param('id') id: string) {
    return this.requestService.cancel(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete request' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async complete(@Param('id') id: string) {
    return this.requestService.complete(id);
  }
}
