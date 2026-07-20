import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PolicyConsentService } from '../services/policy-consent.service';
import { PolicyConsent, ConsentAction } from '../entities/policy-consent.entity';

@ApiTags('policy-consents')
@Controller('api/governance/policy-consents')
export class PolicyConsentController {
  constructor(private readonly service: PolicyConsentService) {}

  @Post('record')
  @ApiOperation({ summary: 'Record policy consent/agreement' })
  @ApiResponse({ status: 201, type: PolicyConsent })
  record(
    @Body('user_id') user_id: string,
    @Body('policy_id') policy_id: string,
    @Body('version') version: string,
    @Body('action') action: ConsentAction,
    @Body('consentedBy') consentedBy?: string
  ): Promise<PolicyConsent> {
    return this.service.record(user_id, policy_id, version, action, consentedBy);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw policy consent' })
  @ApiResponse({ status: 200, type: PolicyConsent })
  withdraw(
    @Body('user_id') user_id: string,
    @Body('policy_id') policy_id: string,
    @Body('reason') reason?: string
  ): Promise<PolicyConsent> {
    return this.service.withdraw(user_id, policy_id, reason);
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Get all consents for a user' })
  @ApiResponse({ status: 200, type: [PolicyConsent] })
  findByUser(@Param('user_id') user_id: string): Promise<PolicyConsent[]> {
    return this.service.findByUser(user_id);
  }

  @Get('policy/:policy_id')
  @ApiOperation({ summary: 'Get all consents for a policy' })
  @ApiResponse({ status: 200, type: [PolicyConsent] })
  findByPolicy(@Param('policy_id') policy_id: string): Promise<PolicyConsent[]> {
    return this.service.findByPolicy(policy_id);
  }

  @Get('check/:user_id/:policy_id')
  @ApiOperation({ summary: 'Check if user has active consent' })
  @ApiResponse({ status: 200 })
  hasActiveConsent(@Param('user_id') user_id: string, @Param('policy_id') policy_id: string): Promise<boolean> {
    return this.service.hasActiveConsent(user_id, policy_id);
  }

  @Get('version/:user_id/:policy_id')
  @ApiOperation({ summary: 'Get last consent version' })
  @ApiResponse({ status: 200 })
  getLastConsentVersion(@Param('user_id') user_id: string, @Param('policy_id') policy_id: string): Promise<string | null> {
    return this.service.getLastConsentVersion(user_id, policy_id);
  }
}
