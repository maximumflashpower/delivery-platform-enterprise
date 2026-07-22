import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConsentManagementService } from '../services/consent-management.service';
import {
  GrantConsentDto,
  RevokeConsentDto,
  SetUserPreferenceDto,
  BulkPreferenceUpdateDto,
  SetNotificationPreferenceDto,
  ListConsentsQueryDto,
} from '../dto/consent-management.dto';

@ApiTags('Consent Management')
@ApiBearerAuth()
@Controller('consent-management')
export class ConsentManagementController {
  constructor(private readonly service: ConsentManagementService) {}

  // ════════════════════════════════════════════
  // CONSENT ENDPOINTS
  // ════════════════════════════════════════════

  @Post('consents/grant')
  @ApiOperation({ summary: 'Grant a consent for a specific purpose' })
  @ApiResponse({ status: 201, description: 'Consent granted successfully' })
  async grantConsent(
    @Body() dto: GrantConsentDto,
    @Query('userId') userId: string,
  ) {
    return this.service.grantConsent(userId, dto);
  }

  @Post('consents/:id/revoke')
  @ApiOperation({ summary: 'Revoke an existing consent' })
  @ApiResponse({ status: 200, description: 'Consent revoked successfully' })
  async revokeConsent(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
    @Body() dto?: RevokeConsentDto,
  ) {
    return this.service.revokeConsent(userId, id, dto);
  }

  @Get('consents')
  @ApiOperation({ summary: 'List all consents for a user' })
  @ApiResponse({ status: 200, description: 'List of user consents' })
  async listConsents(
    @Query('userId') userId: string,
    @Query() query: ListConsentsQueryDto,
  ) {
    return this.service.findAllConsents(userId, query);
  }

  @Get('consents/active')
  @ApiOperation({ summary: 'Get active consents for a user' })
  @ApiResponse({ status: 200, description: 'Active consents list' })
  async getActiveConsents(@Query('userId') userId: string) {
    return this.service.findActiveConsents(userId);
  }

  @Get('consents/:id')
  @ApiOperation({ summary: 'Get a specific consent' })
  @ApiResponse({ status: 200, description: 'Consent details' })
  async getConsent(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ) {
    return this.service.findConsentById(userId, id);
  }

  @Get('consents/:id/history')
  @ApiOperation({ summary: 'Get consent history' })
  @ApiResponse({ status: 200, description: 'Consent history timeline' })
  async getConsentHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getConsentHistory(id);
  }

  // ════════════════════════════════════════════
  // USER PREFERENCE ENDPOINTS
  // ════════════════════════════════════════════

  @Post('preferences')
  @ApiOperation({ summary: 'Set a user preference' })
  @ApiResponse({ status: 201, description: 'Preference created/updated' })
  async setUserPreference(
    @Body() dto: SetUserPreferenceDto,
    @Query('userId') userId: string,
  ) {
    return this.service.setUserPreference(userId, dto);
  }

  @Post('preferences/bulk')
  @ApiOperation({ summary: 'Set multiple preferences at once' })
  @ApiResponse({ status: 201, description: 'Batch preferences updated' })
  async bulkSetPreferences(
    @Body() dto: BulkPreferenceUpdateDto,
    @Query('userId') userId: string,
  ) {
    return this.service.bulkSetPreferences(userId, dto);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get all user preferences' })
  @ApiResponse({ status: 200, description: 'User preferences list' })
  async getUserPreferences(
    @Query('userId') userId: string,
    @Query('category') category?: string,
  ) {
    return this.service.getUserPreferences(userId, category);
  }

  @Get('preferences/:category/:key')
  @ApiOperation({ summary: 'Get a specific preference' })
  @ApiResponse({ status: 200, description: 'Preference value' })
  async getPreference(
    @Query('userId') userId: string,
    @Param('category') category: string,
    @Param('key') key: string,
  ) {
    return this.service.getPreference(userId, category, key);
  }

  @Delete('preferences/:category/:key')
  @ApiOperation({ summary: 'Delete a user preference' })
  @ApiResponse({ status: 200, description: 'Preference deleted' })
  async deletePreference(
    @Query('userId') userId: string,
    @Param('category') category: string,
    @Param('key') key: string,
  ) {
    await this.service.deleteUserPreference(userId, category, key);
    return { message: 'Preference deleted successfully' };
  }

  // ════════════════════════════════════════════
  // NOTIFICATION PREFERENCE ENDPOINTS
  // ════════════════════════════════════════════

  @Post('notifications')
  @ApiOperation({ summary: 'Set notification preference' })
  @ApiResponse({ status: 201, description: 'Notification preference set' })
  async setNotificationPreference(
    @Body() dto: SetNotificationPreferenceDto,
    @Query('userId') userId: string,
  ) {
    return this.service.setNotificationPreference(userId, dto);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences list' })
  async getNotificationPreferences(
    @Query('userId') userId: string,
    @Query('channel') channel?: string,
  ) {
    return this.service.getNotificationPreferences(userId, channel);
  }

  @Get('notifications/check')
  @ApiOperation({ summary: 'Check if notification can be sent' })
  @ApiResponse({ status: 200, description: 'Permission check result' })
  async checkNotificationPermission(
    @Query('userId') userId: string,
    @Query('channel') channel: string,
    @Query('communicationType') communicationType: string,
  ) {
    return this.service.canSendNotification(userId, channel, communicationType);
  }

  // ════════════════════════════════════════════
  // STATS
  // ════════════════════════════════════════════

  @Get('stats')
  @ApiOperation({ summary: 'Get consent management statistics' })
  @ApiResponse({ status: 200, description: 'Consent stats' })
  async getStats() {
    return this.service.getStats();
  }
}
