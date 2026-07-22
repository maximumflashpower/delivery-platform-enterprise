import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AdTransparencyService } from '../services/ad-transparency.service';
import { CreateAdCampaignDto } from '../dto/create-ad-campaign.dto';
import { CreateSponsorshipDto } from '../dto/create-sponsorship.dto';
import { CreateAdSpendDto } from '../dto/create-spend.dto';

@ApiTags('Ad Transparency')
@Controller('ad-transparency')
export class AdTransparencyController {
  constructor(private readonly service: AdTransparencyService) {}

  // ============ CAMPAIGNS ============

  @Post('campaigns')
  @ApiOperation({ summary: 'Register a new ad campaign' })
  async createCampaign(@Body() dto: CreateAdCampaignDto) {
    return this.service.createCampaign(dto);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'List all ad campaigns' })
  @ApiQuery({ name: 'status', required: false })
  async findAllCampaigns(@Query('status') status?: string) {
    return this.service.findAllCampaigns(status);
  }

  @Get('campaigns/stats')
  @ApiOperation({ summary: 'Get ad transparency statistics' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('campaigns/advertiser/:advertiserId')
  @ApiOperation({ summary: 'Get campaigns by advertiser' })
  async getCampaignsByAdvertiser(@Param('advertiserId') advertiserId: string) {
    return this.service.getCampaignsByAdvertiser(advertiserId);
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get campaign details' })
  async findCampaign(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findCampaign(id);
  }

  @Post('campaigns/:id/review')
  @ApiOperation({ summary: 'Review and approve/reject a campaign' })
  async reviewCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reviewedBy') reviewedBy: string,
    @Body('approved') approved: boolean,
    @Body('reason') reason?: string,
  ) {
    return this.service.reviewCampaign(id, reviewedBy, approved, reason);
  }

  @Post('campaigns/:id/pause')
  @ApiOperation({ summary: 'Pause an active campaign' })
  async pauseCampaign(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.pauseCampaign(id);
  }

  @Post('campaigns/:id/resume')
  @ApiOperation({ summary: 'Resume a paused campaign' })
  async resumeCampaign(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.resumeCampaign(id);
  }

  // ============ SPONSORSHIPS ============

  @Post('sponsorships')
  @ApiOperation({ summary: 'Register a new sponsorship' })
  async createSponsorship(@Body() dto: CreateSponsorshipDto) {
    return this.service.createSponsorship(dto);
  }

  @Get('sponsorships')
  @ApiOperation({ summary: 'List all sponsorships' })
  @ApiQuery({ name: 'status', required: false })
  async findAllSponsorships(@Query('status') status?: string) {
    return this.service.findAllSponsorships(status);
  }

  @Get('sponsorships/sponsor/:sponsorId')
  @ApiOperation({ summary: 'Get sponsorships by sponsor' })
  async getSponsorshipsBySponsor(@Param('sponsorId') sponsorId: string) {
    return this.service.getSponsorshipsBySponsor(sponsorId);
  }

  @Get('sponsorships/:id')
  @ApiOperation({ summary: 'Get sponsorship details' })
  async findSponsorship(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findSponsorship(id);
  }

  @Post('sponsorships/:id/disclose')
  @ApiOperation({ summary: 'Disclose a sponsorship' })
  async discloseSponsorship(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.discloseSponsorship(id);
  }

  @Post('sponsorships/:id/activate')
  @ApiOperation({ summary: 'Activate a disclosed sponsorship' })
  async activateSponsorship(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.activateSponsorship(id);
  }

  @Post('sponsorships/:id/end')
  @ApiOperation({ summary: 'End a sponsorship' })
  async endSponsorship(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.endSponsorship(id);
  }

  @Post('sponsorships/:id/terminate')
  @ApiOperation({ summary: 'Terminate a sponsorship' })
  async terminateSponsorship(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ) {
    return this.service.terminateSponsorship(id, reason);
  }

  // ============ AD SPEND ============

  @Post('spends')
  @ApiOperation({ summary: 'Record ad spend' })
  async createSpend(@Body() dto: CreateAdSpendDto) {
    return this.service.createSpend(dto);
  }

  @Get('spends/campaign/:campaignId')
  @ApiOperation({ summary: 'Get spend records by campaign' })
  async findSpendsByCampaign(@Param('campaignId') campaignId: string) {
    return this.service.findSpendsByCampaign(campaignId);
  }

  // ============ REPORTS ============

  @Get('report')
  @ApiOperation({ summary: 'Get advertising transparency report' })
  @ApiQuery({ name: 'advertiserId', required: false })
  async getTransparencyReport(@Query('advertiserId') advertiserId?: string) {
    return this.service.getTransparencyReport(advertiserId);
  }
}
