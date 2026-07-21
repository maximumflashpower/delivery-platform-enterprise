import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CommunityHealthService } from '../services/community-health.service';
import { CreateCommunityHealthMetricDto } from '../dto/create-community-health-metric.dto';
import { CommunityHealthMetric } from '../entities/community-health-metric.entity';

@ApiTags('Governance - Community Health')
@Controller('governance/health')
export class CommunityHealthController {
  constructor(private readonly healthService: CommunityHealthService) {}

  @Post()
  @ApiOperation({ summary: 'Create health metric record' })
  @ApiResponse({ status: 201, description: 'Metric created', type: CommunityHealthMetric })
  async create(@Body() dto: CreateCommunityHealthMetricDto): Promise<CommunityHealthMetric> {
    return this.healthService.create(dto);
  }

  @Get('community/:communityId')
  @ApiOperation({ summary: 'Get health metrics for a community' })
  @ApiParam({ name: 'communityId', description: 'Community UUID' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'List of metrics', type: [CommunityHealthMetric] })
  async findByCommunity(
    @Param('communityId') communityId: string,
    @Query('limit') limit?: string,
  ): Promise<CommunityHealthMetric[]> {
    return this.healthService.findByCommunity(communityId, limit ? parseInt(limit) : undefined);
  }

  @Get('community/:communityId/latest')
  @ApiOperation({ summary: 'Get latest health metric for a community' })
  @ApiParam({ name: 'communityId', description: 'Community UUID' })
  @ApiResponse({ status: 200, description: 'Latest metric', type: CommunityHealthMetric })
  async latest(@Param('communityId') communityId: string): Promise<CommunityHealthMetric> {
    return this.healthService.latest(communityId);
  }

  @Post('community/:communityId/calculate')
  @ApiOperation({ summary: 'Calculate and record health metrics' })
  @ApiParam({ name: 'communityId', description: 'Community UUID' })
  @ApiResponse({ status: 201, description: 'Metric calculated and saved', type: CommunityHealthMetric })
  async calculateAndRecord(
    @Param('communityId') communityId: string,
    @Body() data: Partial<CommunityHealthMetric>,
  ): Promise<CommunityHealthMetric> {
    return this.healthService.calculateAndRecord(communityId, data);
  }

  @Get('community/:communityId/trend')
  @ApiOperation({ summary: 'Get health metric trend' })
  @ApiParam({ name: 'communityId', description: 'Community UUID' })
  @ApiQuery({ name: 'days', required: false })
  @ApiResponse({ status: 200, description: 'Trend data', type: [CommunityHealthMetric] })
  async getTrend(
    @Param('communityId') communityId: string,
    @Query('days') days?: string,
  ): Promise<CommunityHealthMetric[]> {
    return this.healthService.getTrend(communityId, days ? parseInt(days) : 30);
  }
}
