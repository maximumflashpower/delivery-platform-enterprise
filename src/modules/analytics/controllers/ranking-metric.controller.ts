import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankingMetricService } from '../services/ranking-metric.service';
import { RankingMetric, MetricType } from '../entities/ranking-metric.entity';

@ApiTags('ranking-metrics')
@Controller('analytics/ranking-metrics')
export class RankingMetricController {
  constructor(private readonly service: RankingMetricService) {}

  @Post()
  @ApiOperation({ summary: 'Record a ranking metric' })
  @ApiResponse({ status: 201, type: RankingMetric })
  record(
    @Body('modelId') modelId: string,
    @Body('type') type: MetricType,
    @Body('value') value: number,
    @Body('previousValue') previousValue?: number,
    @Body('notes') notes?: string
  ): Promise<RankingMetric> {
    return this.service.record(modelId, type, value, previousValue, notes);
  }

  @Get('model/:modelId')
  @ApiOperation({ summary: 'Get metrics for a model' })
  @ApiResponse({ status: 200, type: [RankingMetric] })
  findByModel(@Param('modelId') modelId: string, @Query('type') type?: MetricType): Promise<RankingMetric[]> {
    return this.service.findByModel(modelId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific metric' })
  @ApiResponse({ status: 200, type: RankingMetric })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RankingMetric> {
    return this.service.findOne(id);
  }

  @Get('model/:modelId/latest')
  @ApiOperation({ summary: 'Get latest metric for a model and type' })
  @ApiResponse({ status: 200, type: RankingMetric })
  getLatest(@Param('modelId') modelId: string, @Query('type') type: MetricType): Promise<RankingMetric | null> {
    return this.service.getLatest(modelId, type);
  }
}
