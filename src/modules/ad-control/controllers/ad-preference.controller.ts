import { Controller, Get, Post, Patch, Put, Delete, Query, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AdPreferenceService } from '../services/ad-preference.service';
import { CreateAdPreferenceDto } from '../dto/create-ad-preference.dto';
import { UpdateAdPreferenceDto } from '../dto/update-ad-preference.dto';
import { BulkUpdateAdPreferenceDto } from '../dto/bulk-update-ad-preference.dto';

@ApiTags('Ad Preferences')
@ApiBearerAuth()
@Controller('privacy-consent/ad-preferences')
export class AdPreferenceController {
  constructor(private readonly service: AdPreferenceService) {}

  @Get()
  @ApiOperation({ summary: 'List all ad preferences' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'adCategory', required: false })
  findAll(@Query('userId') userId?: string, @Query('adCategory') adCategory?: string) {
    return this.service.findAll(userId, adCategory);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all ad preferences for a user' })
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single ad preference by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new ad preference' })
  create(@Body() dto: CreateAdPreferenceDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update an ad preference' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAdPreferenceDto) {
    return this.service.update(id, dto);
  }

  @Put('bulk/:userId')
  @ApiOperation({ summary: 'Bulk upsert ad preferences for a user' })
  bulkUpdate(@Param('userId') userId: string, @Body() dto: BulkUpdateAdPreferenceDto) {
    return this.service.bulkUpdate(dto);
  }

  @Post('reset/:userId')
  @ApiOperation({ summary: 'Reset all ad preferences to defaults for a user' })
  resetToDefaults(@Param('userId') userId: string) {
    return this.service.resetToDefaults(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ad preference' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
