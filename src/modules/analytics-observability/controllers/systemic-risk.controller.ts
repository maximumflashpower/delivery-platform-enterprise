import { Controller, Get, Post, Patch, Body, Param, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SystemicRiskService } from '../services/systemic-risk.service';
import { CreateIndicatorDto, UpdateIndicatorDto, CreateCorrelationDto, CreateIncidentDto, ResolveIncidentDto } from '../dto/systemic-risk.dto';

@ApiTags('Systemic Risk Center')
@Controller('analytics/systemic-risk')
export class SystemicRiskController {
  constructor(private readonly service: SystemicRiskService) {}

  // ═══ INDICATORS ═══

  @Get('indicators')
  @ApiOperation({ summary: 'List all risk indicators' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'status', required: false })
  async listIndicators(
    @Query('category') category?: string,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAllIndicators({ category, severity, status });
  }

  @Get('indicators/stats')
  @ApiOperation({ summary: 'Get systemic risk stats' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('indicators/:id')
  @ApiOperation({ summary: 'Get indicator by ID' })
  async getIndicator(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findIndicatorById(id);
  }

  @Post('indicators')
  @ApiOperation({ summary: 'Create risk indicator' })
  @ApiResponse({ status: 201 })
  async createIndicator(@Body() dto: CreateIndicatorDto) {
    return this.service.createIndicator(dto);
  }

  @Patch('indicators/:id')
  @ApiOperation({ summary: 'Update indicator' })
  async updateIndicator(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateIndicatorDto) {
    return this.service.updateIndicator(id, dto);
  }

  @Post('indicators/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge indicator' })
  async acknowledge(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.acknowledgeIndicator(id);
  }

  @Post('indicators/:id/resolve')
  @ApiOperation({ summary: 'Resolve indicator with mitigation plan' })
  async resolve(@Param('id', ParseUUIDPipe) id: string, @Body('mitigationPlan') plan: string) {
    return this.service.resolveIndicator(id, plan);
  }

  // ═══ CORRELATIONS ═══

  @Get('correlations')
  @ApiOperation({ summary: 'List all correlations' })
  async listCorrelations() {
    return this.service.findAllCorrelations();
  }

  @Get('correlations/indicator/:indicatorId')
  @ApiOperation({ summary: 'Find correlations by indicator' })
  async correlationsByIndicator(@Param('indicatorId', ParseUUIDPipe) indicatorId: string) {
    return this.service.findCorrelationsByIndicator(indicatorId);
  }

  @Post('correlations')
  @ApiOperation({ summary: 'Create risk correlation' })
  async createCorrelation(@Body() dto: CreateCorrelationDto) {
    return this.service.createCorrelation(dto);
  }

  // ═══ INCIDENTS ═══

  @Get('incidents')
  @ApiOperation({ summary: 'List all incidents' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  async listIncidents(
    @Query('status') status?: string,
    @Query('severity') severity?: string,
  ) {
    return this.service.findAllIncidents({ status, severity });
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Get incident by ID' })
  async getIncident(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findIncidentById(id);
  }

  @Post('incidents')
  @ApiOperation({ summary: 'Create risk incident' })
  async createIncident(@Body() dto: CreateIncidentDto) {
    return this.service.createIncident(dto);
  }

  @Post('incidents/:id/investigate')
  @ApiOperation({ summary: 'Start investigating incident' })
  async investigate(@Param('id', ParseUUIDPipe) id: string, @Body('assignedTo') assignedTo: string) {
    return this.service.investigateIncident(id, assignedTo);
  }

  @Post('incidents/:id/resolve')
  @ApiOperation({ summary: 'Resolve incident' })
  async resolveIncident(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ResolveIncidentDto) {
    return this.service.resolveIncident(id, dto);
  }
}
