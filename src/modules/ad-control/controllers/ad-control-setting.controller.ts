import { Controller, Get, Post, Put, Delete, Query, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AdControlSettingService } from '../services/ad-control-setting.service';
import { CreateAdControlSettingDto } from '../dto/create-ad-control-setting.dto';
import { UpdateAdControlSettingDto } from '../dto/update-ad-control-setting.dto';

@ApiTags('Ad Control Settings')
@ApiBearerAuth()
@Controller('configuration/ad-controls')
export class AdControlSettingController {
  constructor(private readonly service: AdControlSettingService) {}

  @Get()
  @ApiOperation({ summary: 'List all ad control settings' })
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query('category') category?: string) {
    return this.service.findAll(category);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get a setting by key' })
  findByKey(@Param('key') key: string) {
    return this.service.findByKey(key);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single setting by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new ad control setting' })
  create(@Body() dto: CreateAdControlSettingDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a setting' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAdControlSettingDto) {
    return this.service.update(id, dto);
  }

  @Put('key/:key')
  @ApiOperation({ summary: 'Update a setting by key' })
  updateByKey(@Param('key') key: string, @Body() dto: UpdateAdControlSettingDto) {
    return this.service.updateByKey(key, dto.settingValue ?? "");
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a setting' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
