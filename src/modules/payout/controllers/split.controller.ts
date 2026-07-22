import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SplitService } from '../services/split.service';
import { CreateSplitDto } from '../dto/create-split.dto';
import { CreateRiskAssessmentDto } from '../dto/create-risk-assessment.dto';

@ApiTags('Sponsor Splits')
@Controller('splits')
export class SplitController {
  constructor(private readonly splitService: SplitService) {}

  // ============ SPLITS ============

  @Post()
  @ApiOperation({ summary: 'Create a new sponsor split' })
  @ApiResponse({ status: 201, description: 'Split created' })
  async createSplit(@Body() dto: CreateSplitDto) {
    return this.splitService.createSplit(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all splits' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  async findAllSplits(@Query('status') status?: string) {
    return this.splitService.findAllSplits(status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get split statistics' })
  async getStats() {
    return this.splitService.getSplitStats();
  }

  @Get('reference/:referenceId')
  @ApiOperation({ summary: 'Get splits by reference ID' })
  @ApiParam({ name: 'referenceId', description: 'Reference ID (order, campaign, etc.)' })
  async getSplitsByReference(@Param('referenceId') referenceId: string) {
    return this.splitService.getSplitsByReference(referenceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get split details' })
  @ApiParam({ name: 'id', description: 'Split ID' })
  async findSplit(@Param('id', ParseUUIDPipe) id: string) {
    return this.splitService.findSplit(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve a split' })
  @ApiParam({ name: 'id', description: 'Split ID' })
  async approveSplit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.splitService.approveSplit(id, approvedBy);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute an approved split' })
  @ApiParam({ name: 'id', description: 'Split ID' })
  async executeSplit(@Param('id', ParseUUIDPipe) id: string) {
    return this.splitService.executeSplit(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a split' })
  @ApiParam({ name: 'id', description: 'Split ID' })
  async cancelSplit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ) {
    return this.splitService.cancelSplit(id, reason);
  }

  // ============ RISK ASSESSMENTS ============

  @Post('risk-assessments')
  @ApiOperation({ summary: 'Create a sponsor risk assessment' })
  async createRiskAssessment(@Body() dto: CreateRiskAssessmentDto) {
    return this.splitService.createRiskAssessment(dto);
  }

  @Get('risk-assessments')
  @ApiOperation({ summary: 'List all risk assessments' })
  async findAllRiskAssessments() {
    return this.splitService.findAllRiskAssessments();
  }

  @Get('risk-assessments/:id')
  @ApiOperation({ summary: 'Get risk assessment details' })
  @ApiParam({ name: 'id', description: 'Risk assessment ID' })
  async findRiskAssessment(@Param('id', ParseUUIDPipe) id: string) {
    return this.splitService.findRiskAssessment(id);
  }

  @Get('risk-assessments/sponsor/:sponsorId')
  @ApiOperation({ summary: 'Get risk assessments by sponsor' })
  @ApiParam({ name: 'sponsorId', description: 'Sponsor ID' })
  async getRiskBySponsor(@Param('sponsorId') sponsorId: string) {
    return this.splitService.getRiskBySponsor(sponsorId);
  }

  @Post('risk-assessments/:id/approve')
  @ApiOperation({ summary: 'Approve a risk assessment' })
  @ApiParam({ name: 'id', description: 'Risk assessment ID' })
  async approveRiskAssessment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('approvedBy') approvedBy: string,
  ) {
    return this.splitService.approveRiskAssessment(id, approvedBy);
  }

  @Post('risk-assessments/:id/reject')
  @ApiOperation({ summary: 'Reject a risk assessment' })
  @ApiParam({ name: 'id', description: 'Risk assessment ID' })
  async rejectRiskAssessment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('rejectedBy') rejectedBy: string,
    @Body('reason') reason: string,
  ) {
    return this.splitService.rejectRiskAssessment(id, rejectedBy, reason);
  }
}
