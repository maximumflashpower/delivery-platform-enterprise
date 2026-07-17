import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ExperimentService } from '../services/experiment.service';
import { Experiment } from '../entities/experiment.entity';

@Controller('experiments')
export class ExperimentController {
  constructor(private readonly experimentService: ExperimentService) {}

  @Get()
  findAll(@Query('status') status?: string): Promise<Experiment[]> {
    return this.experimentService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Experiment | null> {
    return this.experimentService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Experiment>): Promise<Experiment> {
    return this.experimentService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Experiment>): Promise<Experiment | null> {
    return this.experimentService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.experimentService.remove(id);
  }
}
