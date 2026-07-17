import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { ListingService } from '../services/listing.service';
import { Listing } from '../entities/listing.entity';

@Controller('listings')
@ApiTags('Host Travel - Listings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Get()
  @ApiOperation({ summary: 'List all listings' })
  @ApiResponse({ status: 200, type: [Listing] })
  async findAll() {
    return this.listingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Listing })
  async findById(@Param('id') id: string) {
    return this.listingService.findById(id);
  }

  @Get('host/:hostId')
  @ApiOperation({ summary: 'List listings by host ID' })
  @ApiParam({ name: 'hostId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [Listing] })
  async findByHostId(@Param('hostId') hostId: string) {
    return this.listingService.findByHostId(hostId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new listing' })
  @ApiBody({ type: Listing })
  @ApiResponse({ status: 201, type: Listing })
  async create(@Body() data: Partial<Listing>) {
    return this.listingService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update listing' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: Listing })
  async update(@Param('id') id: string, @Body() data: Partial<Listing>) {
    return this.listingService.update(id, data);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve listing' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async approve(@Param('id') id: string) {
    return this.listingService.approve(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate listing' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async deactivate(@Param('id') id: string) {
    return this.listingService.deactivate(id);
  }

  @Post(':id/block')
  @ApiOperation({ summary: 'Block listing' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async block(@Param('id') id: string) {
    return this.listingService.block(id);
  }
}
