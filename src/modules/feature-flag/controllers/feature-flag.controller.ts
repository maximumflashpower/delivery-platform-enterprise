import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { FeatureFlagService } from '../services/feature-flag.service';
import { FeatureFlag } from '../entities/feature-flag.entity';

@ApiTags('Feature Flags')
@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private readonly flagService: FeatureFlagService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('environment') environment?: string): Promise<FeatureFlag[]> {
    return this.flagService.findAll(environment);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<FeatureFlag | null> {
    return this.flagService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<FeatureFlag>): Promise<FeatureFlag> {
    return this.flagService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<FeatureFlag>): Promise<FeatureFlag | null> {
    return this.flagService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.flagService.remove(id);
  }
}
