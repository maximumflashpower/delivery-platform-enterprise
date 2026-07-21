import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RevenueDashboardService } from '../services/revenue-dashboard.service';
import { GenerateSnapshotDto } from '../dto/generate-snapshot.dto';
import { RevenueSnapshot } from '../entities/revenue-snapshot.entity';

@ApiTags('Revenue Dashboard')
@Controller('revenue-dashboard')
export class RevenueDashboardController {
  constructor(
    private readonly revenueDashboardService: RevenueDashboardService,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get revenue overview for period' })
  @ApiResponse({ status: 200, description: 'Revenue overview retrieved', type: Object })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  async getOverview(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Object> {
    return this.revenueDashboardService.getOverview(startDate, endDate);
  }

  @Get('snapshots')
  @ApiOperation({ summary: 'List all revenue snapshots' })
  @ApiResponse({ status: 200, description: 'Snapshots list', type: [RevenueSnapshot] })
  async findAllSnapshots(): Promise<RevenueSnapshot[]> {
    return this.revenueDashboardService.findAllSnapshots();
  }

  @Get('snapshots/:id')
  @ApiOperation({ summary: 'Get specific snapshot' })
  @ApiResponse({ status: 200, description: 'Snapshot details', type: RevenueSnapshot })
  @ApiParam({ name: 'id', description: 'Snapshot ID' })
  async findSnapshot(@Param('id', ParseUUIDPipe) id: string): Promise<RevenueSnapshot> {
    return this.revenueDashboardService.findSnapshot(id);
  }

  @Post('snapshots/generate')
  @ApiOperation({ summary: 'Generate new revenue snapshot' })
  @ApiResponse({ status: 201, description: 'Snapshot generated', type: RevenueSnapshot })
  async generateSnapshot(@Body() dto: GenerateSnapshotDto): Promise<RevenueSnapshot> {
    return this.revenueDashboardService.generateSnapshot(dto);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get revenue trends' })
  @ApiResponse({ status: 200, description: 'Trend data' })
  @ApiQuery({ name: 'period', required: false, description: 'daily, weekly, monthly', enum: ['daily', 'weekly', 'monthly'] })
  async getTrends(@Query('period') period?: string): Promise<Object> {
    return this.revenueDashboardService.getTrends(period || 'daily');
  }

  @Get('by-domain')
  @ApiOperation({ summary: 'Revenue breakdown by domain' })
  @ApiResponse({ status: 200, description: 'Domain breakdown' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getByDomain(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Object> {
    return this.revenueDashboardService.getByDomain(startDate, endDate);
  }
}
