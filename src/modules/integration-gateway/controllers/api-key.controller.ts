import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from '../../../common/decorators/public-route.decorator';
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiKeyService } from '../services/api-key.service';
import { ApiKey } from '../entities/api-key.entity';

@ApiTags('Integration')
@Controller('integration/api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @PublicRoute()
  @Get()
  findAll(@Query('userId') userId?: string): Promise<ApiKey[]> {
    return this.apiKeyService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiKey | null> {
    return this.apiKeyService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<ApiKey>): Promise<ApiKey> {
    return this.apiKeyService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<ApiKey>): Promise<ApiKey | null> {
    return this.apiKeyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.apiKeyService.remove(id);
  }

  @Put(':id/deactivate')
  deactivate(@Param('id') id: string): Promise<void> {
    return this.apiKeyService.deactivate(id);
  }
}
