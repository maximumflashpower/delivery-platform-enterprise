import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BiometricConsentService } from '../services/biometric-consent.service';
import { GiveBiometricConsentDto, RevokeBiometricConsentDto } from '../dto/biometric-consent.dto';

@ApiTags('Privacy Consent - Biometric Data')
@Controller('privacy-consent/biometric')
export class BiometricConsentController {
  constructor(private readonly service: BiometricConsentService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get biometric consent statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all biometric consents for a user' })
  async findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Post('grant')
  @ApiOperation({ summary: 'Give biometric consent' })
  async grantConsent(@Body() dto: GiveBiometricConsentDto) {
    return this.service.giveConsent(dto);
  }

  @Post('revoke')
  @ApiOperation({ summary: 'Revoke biometric consent' })
  async revokeConsent(@Body() dto: RevokeBiometricConsentDto) {
    return this.service.revokeConsent(dto);
  }

  @Post('check')
  @ApiOperation({ summary: 'Check if user has valid consent' })
  async checkConsent(@Body() dto: { userId: string; biometricType: string }) {
    const hasConsent = await this.service.hasValidConsent(dto.userId, dto.biometricType);
    return { userId: dto.userId, biometricType: dto.biometricType, hasValidConsent: hasConsent };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consent details by ID' })
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
