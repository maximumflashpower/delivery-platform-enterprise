import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ModelVersionService } from '../services/model-version.service';
import { ModelVersion } from '../entities/model-version.entity';

@Controller('ml/models')
export class ModelVersionController {
  constructor(private readonly modelService: ModelVersionService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('status') status?: string): Promise<ModelVersion[]> {
    return this.modelService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ModelVersion | null> {
    return this.modelService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<ModelVersion>): Promise<ModelVersion> {
    return this.modelService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<ModelVersion>): Promise<ModelVersion | null> {
    return this.modelService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.modelService.remove(id);
  }
}
