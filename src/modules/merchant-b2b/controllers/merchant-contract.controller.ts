import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { MerchantContractService } from '../services/merchant-contract.service';
import { MerchantContract } from '../entities/merchant-contract.entity';

@Controller('merchant-contracts')
@ApiTags('Merchant B2B - Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class MerchantContractController {
  constructor(private readonly contractService: MerchantContractService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all contracts' })
  @ApiResponse({ status: 200, type: [MerchantContract] })
  async findAll() {
    return this.contractService.findAll();
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'List contracts by merchant ID' })
  @ApiParam({ name: 'merchantId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [MerchantContract] })
  async findByMerchantId(@Param('merchantId') merchantId: string) {
    return this.contractService.findByMerchantId(merchantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) {
    return this.contractService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create merchant contract' })
  @ApiBody({ type: MerchantContract })
  @ApiResponse({ status: 201, type: MerchantContract })
  async create(@Body() data: Partial<MerchantContract>) {
    return this.contractService.create(data);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate contract' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async activate(@Param('id') id: string) {
    return this.contractService.activate(id);
  }

  @Post(':id/terminate')
  @ApiOperation({ summary: 'Terminate contract' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async terminate(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.contractService.terminate(id, body?.reason);
  }

  @Post(':id/renew')
  @ApiOperation({ summary: 'Renew contract' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { newEndDate: { type: 'string', format: 'date' } } } })
  async renew(@Param('id') id: string, @Body() body: { newEndDate: string }) {
    return this.contractService.renew(id, new Date(body.newEndDate));
  }
}
