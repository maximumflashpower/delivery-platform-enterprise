import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ServiceBookingService } from '../services/service-booking.service';
import { ServiceBooking } from '../entities/service-booking.entity';

@Controller('service-bookings')
@ApiTags('Local Services - Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ServiceBookingController {
  constructor(private readonly bookingService: ServiceBookingService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all bookings' })
  @ApiResponse({ status: 200, type: [ServiceBooking] })
  async findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ServiceBooking })
  async findById(@Param('id') id: string) {
    return this.bookingService.findById(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'List bookings by customer ID' })
  @ApiParam({ name: 'customerId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [ServiceBooking] })
  async findByCustomerId(@Param('customerId') customerId: string) {
    return this.bookingService.findByCustomerId(customerId);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'List bookings by provider ID' })
  @ApiParam({ name: 'providerId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [ServiceBooking] })
  async findByProviderId(@Param('providerId') providerId: string) {
    return this.bookingService.findByProviderId(providerId);
  }

  @Post()
  @ApiOperation({ summary: 'Create service booking' })
  @ApiBody({ type: ServiceBooking })
  @ApiResponse({ status: 201, type: ServiceBooking })
  async create(@Body() data: Partial<ServiceBooking>) {
    return this.bookingService.create(data);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm booking' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async confirm(@Param('id') id: string) {
    return this.bookingService.confirm(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start service' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async start(@Param('id') id: string) {
    return this.bookingService.start(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete booking' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async complete(@Param('id') id: string) {
    return this.bookingService.complete(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancel(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.bookingService.cancel(id, body?.reason);
  }

  @Post(':id/mark-no-show')
  @ApiOperation({ summary: 'Mark booking as no-show' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markNoShow(@Param('id') id: string) {
    return this.bookingService.markNoShow(id);
  }
}
