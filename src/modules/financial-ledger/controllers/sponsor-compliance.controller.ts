import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SponsorComplianceService } from '../services/sponsor-compliance.service';
import { CreateComplianceRecordDto, UpdateComplianceRecordDto } from '../dto/sponsor-compliance.dto';

@ApiTags('Sponsor Compliance')
@Controller('financial/sponsor-compliance')
export class SponsorComplianceController {
  constructor(private readonly service: SponsorComplianceService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get compliance stats' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('sponsor/:sponsorId/summary')
  @ApiOperation({ summary: 'Get sponsor compliance summary' })
  async getSponsorSummary(@Param('sponsorId', ParseUUIDPipe) sponsorId: string) {
    return this.service.getSponsorComplianceSummary(sponsorId);
  }

  @Get()
  @ApiOperation({ summary: 'List compliance records' })
  async list(
    @Query('sponsorId') sponsorId?: string,
    @Query('checkType') checkType?: string,
    @Query('reviewStatus') reviewStatus?: string,
  ) {
    return this.service.findAll({ sponsorId, checkType, reviewStatus });
  }

  @Get('sponsor/:sponsorId')
  @ApiOperation({ summary: 'Get records by sponsor' })
  async getBySponsor(@Param('sponsorId', ParseUUIDPipe) sponsorId: string) {
    return this.service.findBySponsor(sponsorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get record by ID' })
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create compliance record' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateComplianceRecordDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update compliance record' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateComplianceRecordDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/pass')
  @ApiOperation({ summary: 'Pass verification' })
  async pass(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.passVerification(id);
  }

  @Post(':id/fail')
  @ApiOperation({ summary: 'Fail verification' })
  async fail(@Param('id', ParseUUIDPipe) id: string, @Body('notes') notes: string) {
    return this.service.failVerification(id, notes);
  }

  @Post(':id/remediation')
  @ApiOperation({ summary: 'Require remediation' })
  async remediation(@Param('id', ParseUUIDPipe) id: string, @Body('notes') notes: string) {
    return this.service.requireRemediation(id, notes);
  }

  @Post(':id/exemption')
  @ApiOperation({ summary: 'Grant exemption' })
  async exemption(@Param('id', ParseUUIDPipe) id: string, @Body('notes') notes: string) {
    return this.service.grantExemption(id, notes);
  }
}
