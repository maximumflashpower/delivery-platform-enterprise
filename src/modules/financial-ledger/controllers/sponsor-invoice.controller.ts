import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SponsorInvoiceService } from '../services/sponsor-invoice.service';
import { CreateSponsorInvoiceDto, UpdateInvoiceStatusDto, MarkPaidDto, SubmitDisputeDto, RunComplianceCheckDto } from '../dto/sponsor-invoice.dto';

@ApiTags('Sponsor Invoices')
@Controller('financial/sponsor-invoices')
export class SponsorInvoiceController {
  constructor(private readonly service: SponsorInvoiceService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get invoice stats' })
  async getStats() {
    return this.service.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'List all invoices' })
  async list(
    @Query('status') status?: string,
    @Query('complianceStatus') complianceStatus?: string,
    @Query('sponsorId') sponsorId?: string,
    @Query('merchantId') merchantId?: string,
  ) {
    return this.service.findAll({ status, complianceStatus, sponsorId, merchantId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create invoice' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateSponsorInvoiceDto) {
    return this.service.create(dto);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send invoice' })
  async send(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.send(id);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Mark as paid' })
  async pay(@Param('id', ParseUUIDPipe) id: string, @Body() dto: MarkPaidDto) {
    return this.service.markPaid(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInvoiceStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Post(':id/dispute')
  @ApiOperation({ summary: 'Submit dispute' })
  async dispute(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SubmitDisputeDto) {
    return this.service.submitDispute(id, dto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel invoice' })
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.cancel(id);
  }

  @Patch(':id/compliance')
  @ApiOperation({ summary: 'Run compliance check' })
  async complianceCheck(@Param('id', ParseUUIDPipe) id: string, @Body() dto: RunComplianceCheckDto) {
    return this.service.runComplianceCheck(id, dto);
  }

  @Post(':id/line-items')
  @ApiOperation({ summary: 'Add line item' })
  async addLineItem(@Param('id', ParseUUIDPipe) id: string, @Body() item: Record<string, any>) {
    return this.service.addLineItem(id, item);
  }
}
