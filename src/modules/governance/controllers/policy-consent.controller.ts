import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PolicyConsentService } from '../services/policy-consent.service';
import { PolicyConsent, ConsentAction } from '../entities/policy-consent.entity';

@ApiTags('policy-consents')
@Controller('governance/policy-consents')
export class PolicyConsentController {
  constructor(private readonly service: PolicyConsentService) {}

  @Post('record')
  @ApiOperation({ summary: 'Record policy consent/agreement' })
  @ApiResponse({ status: 201, type: PolicyConsent })
  record(
    @Body('userId') userId: string,
    @Body('policyId') policyId: string,
    @Body('version') version: string,
    @Body('action') action: ConsentAction,
    @Body('consentedBy') consentedBy?: string
  ): Promise<PolicyConsent> {
    return this.service.record(userId, policyId, version, action, consentedBy);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw policy consent' })
  @ApiResponse({ status: 200, type: PolicyConsent })
  withdraw(
    @Body('userId') userId: string,
    @Body('policyId') policyId: string,
    @Body('reason') reason?: string
  ): Promise<PolicyConsent> {
    return this.service.withdraw(userId, policyId, reason);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all consents for a user' })
  @ApiResponse({ status: 200, type: [PolicyConsent] })
  findByUser(@Param('userId') userId: string): Promise<PolicyConsent[]> {
    return this.service.findByUser(userId);
  }

  @Get('policy/:policyId')
  @ApiOperation({ summary: 'Get all consents for a policy' })
  @ApiResponse({ status: 200, type: [PolicyConsent] })
  findByPolicy(@Param('policyId') policyId: string): Promise<PolicyConsent[]> {
    return this.service.findByPolicy(policyId);
  }

  @Get('check/:userId/:policyId')
  @ApiOperation({ summary: 'Check if user has active consent' })
  @ApiResponse({ status: 200 })
  hasActiveConsent(@Param('userId') userId: string, @Param('policyId') policyId: string): Promise<boolean> {
    return this.service.hasActiveConsent(userId, policyId);
  }

  @Get('version/:userId/:policyId')
  @ApiOperation({ summary: 'Get last consent version' })
  @ApiResponse({ status: 200 })
  getLastConsentVersion(@Param('userId') userId: string, @Param('policyId') policyId: string): Promise<string | null> {
    return this.service.getLastConsentVersion(userId, policyId);
  }
}
