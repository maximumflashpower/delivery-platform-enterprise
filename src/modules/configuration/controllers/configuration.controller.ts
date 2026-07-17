import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ConfigurationService } from '../services/configuration.service';
import { Configuration } from '../entities/configuration.entity';

@Controller('configurations')
export class ConfigurationController {
  constructor(private readonly configService: ConfigurationService) {}

  @Get()
  findAll(@Query('scope') scope?: string): Promise<Configuration[]> {
    return this.configService.findAll(scope);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Configuration | null> {
    return this.configService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Configuration>): Promise<Configuration> {
    return this.configService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Configuration>): Promise<Configuration | null> {
    return this.configService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.configService.remove(id);
  }
}
