import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AnalyticsEventService } from '../services/analytics-event.service';
import { AnalyticsEvent } from '../entities/analytics-event.entity';

@Controller('analytics/events')
export class AnalyticsEventController {
  constructor(private readonly analyticsService: AnalyticsEventService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('category') category?: string): Promise<AnalyticsEvent[]> {
    return this.analyticsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AnalyticsEvent | null> {
    return this.analyticsService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<AnalyticsEvent>): Promise<AnalyticsEvent> {
    return this.analyticsService.create(data);
  }
}
