import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ReservationService } from '../services/reservation.service';
import { Reservation } from '../entities/reservation.entity';

@Controller('reservations')
@ApiTags('Host Travel - Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all reservations' })
  @ApiResponse({ status: 200, type: [Reservation] })
  async findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Reservation })
  async findById(@Param('id') id: string) {
    return this.reservationService.findById(id);
  }

  @Get('guest/:guestId')
  @ApiOperation({ summary: 'List reservations by guest ID' })
  @ApiParam({ name: 'guestId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [Reservation] })
  async findByGuestId(@Param('guestId') guestId: string) {
    return this.reservationService.findByGuestId(guestId);
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'List reservations by listing ID' })
  @ApiParam({ name: 'listingId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [Reservation] })
  async findByListingId(@Param('listingId') listingId: string) {
    return this.reservationService.findByListingId(listingId);
  }

  @Post()
  @ApiOperation({ summary: 'Create reservation' })
  @ApiBody({ type: Reservation })
  @ApiResponse({ status: 201, type: Reservation })
  async create(@Body() data: Partial<Reservation>) {
    return this.reservationService.create(data);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm reservation' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async confirm(@Param('id') id: string) {
    return this.reservationService.confirm(id);
  }

  @Post(':id/check-in')
  @ApiOperation({ summary: 'Check in' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async checkIn(@Param('id') id: string) {
    return this.reservationService.checkIn(id);
  }

  @Post(':id/check-out')
  @ApiOperation({ summary: 'Check out' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async checkOut(@Param('id') id: string) {
    return this.reservationService.checkOut(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel reservation' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { refund: { type: 'boolean' } } } })
  async cancel(@Param('id') id: string, @Body() body?: { refund?: boolean }) {
    return this.reservationService.cancel(id, body?.refund ?? true);
  }
}
