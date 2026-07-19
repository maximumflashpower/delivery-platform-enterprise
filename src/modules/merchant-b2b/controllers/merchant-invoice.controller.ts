import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleLevel } from '../../role-profile/enums/role-level.enum';
import { MerchantInvoiceService } from '../services/merchant-invoice.service';
import { MerchantInvoice } from '../entities/merchant-invoice.entity';

@Controller('merchant-invoices')
@ApiTags('Merchant B2B - Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleLevel.ADMIN, RoleLevel.SUPER_ADMIN)
export class MerchantInvoiceController {
  constructor(private readonly invoiceService: MerchantInvoiceService) {}

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'List all invoices' })
  @ApiResponse({ status: 200, type: [MerchantInvoice] })
  async findAll() {
    return this.invoiceService.findAll();
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'List invoices by merchant ID' })
  @ApiParam({ name: 'merchantId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [MerchantInvoice] })
  async findByMerchantId(@Param('merchantId') merchantId: string) {
    return this.invoiceService.findByMerchantId(merchantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findById(@Param('id') id: string) {
    return this.invoiceService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create merchant invoice' })
  @ApiBody({ type: MerchantInvoice })
  @ApiResponse({ status: 201, type: MerchantInvoice })
  async create(@Body() data: Partial<MerchantInvoice>) {
    return this.invoiceService.create(data);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Pay invoice' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async pay(@Param('id') id: string) {
    return this.invoiceService.pay(id);
  }

  @Post(':id/mark-overdue')
  @ApiOperation({ summary: 'Mark invoice as overdue' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async markOverdue(@Param('id') id: string) {
    return this.invoiceService.markOverdue(id);
  }

  @Post(':id/void')
  @ApiOperation({ summary: 'Void invoice' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async void(@Param('id') id: string) {
    return this.invoiceService.void(id);
  }
}
