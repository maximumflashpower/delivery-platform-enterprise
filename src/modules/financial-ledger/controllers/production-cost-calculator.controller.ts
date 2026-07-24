import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductionCostCalculationService } from '../services/production-cost-calculation.service';
import { CreateProductionCostCalculationDto, CreateCostLineItemDto, CalculateTotalsDto, ReviewCalculationDto, ApproveCalculationDto, ListCalculationsQueryDto } from '../dto/production-cost-calculation.dto';
import { CostCalculationStatus } from '../entities/production-cost-calculation.entity';

@ApiTags('Financial Ledger - Production Cost Calculator')
@Controller('financial/production-cost-calculator')
export class ProductionCostCalculatorController {
  constructor(private readonly service: ProductionCostCalculationService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get production cost statistics' })
  async getStats(@Query('merchantId') merchantId?: string) {
    return this.service.getStats(merchantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new production cost calculation' })
  async create(@Body() dto: CreateProductionCostCalculationDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all calculations' })
  async list(@Query() query: ListCalculationsQueryDto) {
    if (query.search) {
      return this.service.search(query.search, query.merchantId);
    }
    return this.service.findByMerchant(query.merchantId || '', query.page || 1, query.limit || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get calculation by ID' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Get line items for calculation' })
  async getLineItems(@Param('id') id: string) {
    return this.service.getLineItems(id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add line item to calculation' })
  async addItem(@Param('id') id: string, @Body() dto: CreateCostLineItemDto) {
    return this.service.addItem(id, dto);
  }

  @Post('recalculate')
  @ApiOperation({ summary: 'Recalculate totals for calculation' })
  async recalculate(@Body() dto: CalculateTotalsDto) {
    return this.service.recalculateTotals(dto.calculationId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update calculation status' })
  async updateStatus(@Param('id') id: string, @Body() dto: any) {
    return this.service.updateStatus(id, dto.status);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Review calculation' })
  async review(@Param('id') id: string, @Body() dto: ReviewCalculationDto) {
    return this.service.review(id, dto);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve calculation' })
  async approve(@Param('id') id: string, @Body() dto: ApproveCalculationDto) {
    return this.service.approve(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete calculation (soft delete)' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Calculation deleted successfully' };
  }
}
