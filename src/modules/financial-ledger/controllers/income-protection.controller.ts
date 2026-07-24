import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IncomeProtectionService } from '../services/income-protection.service';
import { CreateIncomeProtectionPolicyDto, FileClaimDto, ReviewClaimDto, UpdatePolicyStatusDto, ListPoliciesQueryDto } from '../dto/income-protection.dto';

@ApiTags('Financial Ledger - Income Protection')
@Controller('financial/income-protection')
export class IncomeProtectionController {
  constructor(private readonly service: IncomeProtectionService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get income protection statistics' })
  async getStats(@Query('merchantId') merchantId?: string) {
    return this.service.getStats(merchantId);
  }

  @Post('policies')
  @ApiOperation({ summary: 'Create income protection policy' })
  async createPolicy(@Body() dto: CreateIncomeProtectionPolicyDto) {
    return this.service.createPolicy(dto);
  }

  @Get('policies')
  @ApiOperation({ summary: 'List policies' })
  async listPolicies(@Query() query: ListPoliciesQueryDto) {
    return this.service.listPolicies(query.merchantId, query.status, query.page || 1, query.limit || 20);
  }

  @Get('policies/:id')
  @ApiOperation({ summary: 'Get policy by ID' })
  async findPolicyById(@Param('id') id: string) {
    return this.service.findPolicyById(id);
  }

  @Post('policies/:id/activate')
  @ApiOperation({ summary: 'Activate policy' })
  async activatePolicy(@Param('id') id: string) {
    return this.service.activatePolicy(id);
  }

  @Post('policies/:id/suspend')
  @ApiOperation({ summary: 'Suspend policy' })
  async suspendPolicy(@Param('id') id: string) {
    return this.service.suspendPolicy(id);
  }

  @Post('policies/:id/cancel')
  @ApiOperation({ summary: 'Cancel policy' })
  async cancelPolicy(@Param('id') id: string) {
    return this.service.cancelPolicy(id);
  }

  @Patch('policies/:id/status')
  @ApiOperation({ summary: 'Update policy status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdatePolicyStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }

  @Post('policies/:id/claims')
  @ApiOperation({ summary: 'File a claim against policy' })
  async fileClaim(@Param('id') id: string, @Body() dto: FileClaimDto) {
    return this.service.fileClaim(id, dto);
  }

  @Get('policies/:id/claims')
  @ApiOperation({ summary: 'List claims for policy' })
  async getClaims(@Param('id') id: string) {
    return this.service.getClaims(id);
  }

  @Get('claims/:id')
  @ApiOperation({ summary: 'Get claim by ID' })
  async findClaimById(@Param('id') id: string) {
    return this.service.findClaimById(id);
  }

  @Post('claims/:id/review')
  @ApiOperation({ summary: 'Review a claim' })
  async reviewClaim(@Param('id') id: string, @Body() dto: ReviewClaimDto) {
    return this.service.reviewClaim(id, dto);
  }

  @Post('claims/:id/pay')
  @ApiOperation({ summary: 'Pay an approved claim' })
  async payClaim(@Param('id') id: string) {
    return this.service.payClaim(id);
  }

  @Delete('policies/:id')
  @ApiOperation({ summary: 'Delete policy (soft delete)' })
  async deletePolicy(@Param('id') id: string) {
    const policy = await this.service.findPolicyById(id);
    policy.deletedAt = new Date();
    return policy;
  }
}
