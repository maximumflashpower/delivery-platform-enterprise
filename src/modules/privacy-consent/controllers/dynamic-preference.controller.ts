import { Controller, Get, Post, Body, Delete, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DynamicPreferenceService } from '../services/dynamic-preference.service';
import { DynamicPreference } from '../entities/dynamic-preference.entity';

@ApiTags('dynamic-preferences')
@Controller('privacy-consent/preferences')
export class DynamicPreferenceController {
  constructor(private readonly service: DynamicPreferenceService) {}

  @Post('set')
  @ApiOperation({ summary: 'Set a user preference' })
  @ApiResponse({ status: 201, type: DynamicPreference })
  set(
    @Body('userId') userId: string,
    @Body('key') key: string,
    @Body('value') value: string,
    @Body('scope') scope?: string,
    @Body('category') category?: string
  ): Promise<DynamicPreference> {
    return this.service.set(userId, key, value, scope, category);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all preferences for a user' })
  @ApiResponse({ status: 200, type: [DynamicPreference] })
  getAll(@Param('userId') userId: string, @Query('category') category?: string): Promise<DynamicPreference[]> {
    return this.service.getAll(userId, category);
  }

  @Get('user/:userId/key/:key')
  @ApiOperation({ summary: 'Get a specific preference value' })
  @ApiResponse({ status: 200 })
  get(@Param('userId') userId: string, @Param('key') key: string): Promise<string | null> {
    return this.service.get(userId, key);
  }

  @Delete(':userId/key/:key')
  @ApiOperation({ summary: 'Delete a user preference' })
  @ApiResponse({ status: 204 })
  delete(@Param('userId') userId: string, @Param('key') key: string): Promise<void> {
    return this.service.delete(userId, key);
  }
}
