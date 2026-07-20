import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrivacyConsentService } from '../services/privacy-consent.service';
import { PrivacyConsent, ConsentType, ConsentStatus } from '../entities/privacy-consent.entity';

@ApiTags('privacy-consents')
@Controller('api/privacy-consent/consents')
export class PrivacyConsentController {
  constructor(private readonly service: PrivacyConsentService) {}

  @Post('grant')
  @ApiOperation({ summary: 'Grant a consent for user' })
  @ApiResponse({ status: 201, type: PrivacyConsent })
  grant(
    @Body('userId') userId: string,
    @Body('type') type: ConsentType,
    @Body('purpose') purpose?: string,
    @Body('version') version?: string
  ): Promise<PrivacyConsent> {
    return this.service.grant(userId, type, purpose, version);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all consents for a user' })
  @ApiResponse({ status: 200, type: [PrivacyConsent] })
  findByUser(@Param('userId') userId: string): Promise<PrivacyConsent[]> {
    return this.service.findByUser(userId);
  }

  @Get('user/:userId/active')
  @ApiOperation({ summary: 'Get active consents for a user' })
  @ApiResponse({ status: 200, type: [PrivacyConsent] })
  getActiveConsents(@Param('userId') userId: string, @Query('type') type?: ConsentType): Promise<PrivacyConsent[]> {
    return this.service.getActiveConsents(userId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific consent' })
  @ApiResponse({ status: 200, type: PrivacyConsent })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Query('userId') userId: string): Promise<PrivacyConsent> {
    return this.service.findOne(id, userId);
  }

  @Post(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw a consent' })
  @ApiResponse({ status: 200, type: PrivacyConsent })
  withdraw(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId') userId: string,
    @Body('reason') reason?: string
  ): Promise<PrivacyConsent> {
    return this.service.withdraw(userId, id, reason);
  }

  @Get('check/:userId')
  @ApiOperation({ summary: 'Check if user has consent for type' })
  @ApiResponse({ status: 200 })
  checkConsent(@Param('userId') userId: string, @Query('type') type: ConsentType): Promise<boolean> {
    return this.service.checkConsent(userId, type);
  }
}
