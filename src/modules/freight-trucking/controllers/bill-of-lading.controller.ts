import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { BillOfLadingService } from '../services/bill-of-lading.service';
import { BillOfLading } from '../entities/bill-of-lading.entity';

@Controller('bills-of-lading')
@ApiTags('Freight Trucking - Bills of Lading')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class BillOfLadingController {
  constructor(private readonly bolService: BillOfLadingService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all bills of lading' })
  @ApiResponse({ status: 200, type: [BillOfLading] })
  async findAll() { return this.bolService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get bill of lading by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) { return this.bolService.findById(id); }

  @Get('shipment/:shipmentId')
  @ApiOperation({ summary: 'List bills of lading by shipment ID' })
  @ApiParam({ name: 'shipmentId', format: 'uuid' })
  async findByShipmentId(@Param('shipmentId') shipmentId: string) { return this.bolService.findByShipmentId(shipmentId); }

  @Post()
  @ApiOperation({ summary: 'Create bill of lading' })
  @ApiBody({ type: BillOfLading })
  @ApiResponse({ status: 201, type: BillOfLading })
  async create(@Body() data: Partial<BillOfLading>) { return this.bolService.create(data); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bill of lading' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Param('id') id: string, @Body() data: Partial<BillOfLading>) { return this.bolService.update(id, data); }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign bill of lading' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { signerName: { type: 'string' } } } })
  async sign(@Param('id') id: string, @Body() body: { signerName: string }) { return this.bolService.sign(id, body.signerName); }
}
