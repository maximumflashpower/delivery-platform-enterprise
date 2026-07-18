import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SystemMetricService } from '../services/system-metric.service';
import { SystemMetric } from '../entities/system-metric.entity';

@ApiTags('Analytics')
@Controller('observability/metrics')
export class SystemMetricController {
  constructor(private readonly metricService: SystemMetricService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('serviceName') serviceName?: string): Promise<SystemMetric[]> {
    return this.metricService.findAll(serviceName);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SystemMetric | null> {
    return this.metricService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<SystemMetric>): Promise<SystemMetric> {
    return this.metricService.create(data);
  }
}
