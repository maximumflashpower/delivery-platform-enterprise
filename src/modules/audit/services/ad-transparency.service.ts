import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdCampaign, CampaignStatus } from '../entities/ad-campaign.entity';
import { SponsorshipRecord, SponsorshipStatus } from '../entities/sponsorship-record.entity';
import { AdSpendRecord } from '../entities/ad-spend-record.entity';
import { CreateAdCampaignDto } from '../dto/create-ad-campaign.dto';
import { CreateSponsorshipDto } from '../dto/create-sponsorship.dto';
import { CreateAdSpendDto } from '../dto/create-spend.dto';

@Injectable()
export class AdTransparencyService {
  constructor(
    @InjectRepository(AdCampaign)
    private readonly campaignRepo: Repository<AdCampaign>,
    @InjectRepository(SponsorshipRecord)
    private readonly sponsorshipRepo: Repository<SponsorshipRecord>,
    @InjectRepository(AdSpendRecord)
    private readonly spendRepo: Repository<AdSpendRecord>,
  ) {}

  // ============ AD CAMPAIGNS ============

  async createCampaign(dto: CreateAdCampaignDto): Promise<AdCampaign> {
    const campaign = new AdCampaign();
    campaign.campaignName = dto.campaignName;
    campaign.advertiserId = dto.advertiserId;
    campaign.advertiserName = dto.advertiserName;
    campaign.campaignType = dto.campaignType as any;
    campaign.status = CampaignStatus.DRAFT;
    campaign.totalBudget = dto.totalBudget || 0;
    campaign.spentAmount = 0;
    campaign.currency = dto.currency || 'USD';
    campaign.startDate = dto.startDate ? new Date(dto.startDate) : null;
    campaign.endDate = dto.endDate ? new Date(dto.endDate) : null;
    campaign.targetAudience = dto.targetAudience || null;
    campaign.disclosureRequired = true;
    campaign.isPolitical = dto.isPolitical || false;
    return this.campaignRepo.save(campaign);
  }

  async findAllCampaigns(status?: string): Promise<AdCampaign[]> {
    const where: any = {};
    if (status) where.status = status;
    return this.campaignRepo.find({ where, order: { createdAt: 'DESC' } as any });
  }

  async findCampaign(id: string): Promise<AdCampaign> {
    const campaign = await this.campaignRepo.findOne({ where: { id } });
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    return campaign;
  }

  async reviewCampaign(id: string, reviewedBy: string, approved: boolean, reason?: string): Promise<AdCampaign> {
    const campaign = await this.findCampaign(id);
    if (campaign.status !== CampaignStatus.PENDING_REVIEW && campaign.status !== CampaignStatus.DRAFT) {
      throw new BadRequestException('Campaign must be in draft or pending review');
    }
    campaign.status = approved ? CampaignStatus.ACTIVE : CampaignStatus.REJECTED;
    campaign.reviewedBy = reviewedBy;
    campaign.reviewedAt = new Date();
    if (!approved && reason) campaign.rejectionReason = reason;
    return this.campaignRepo.save(campaign);
  }

  async pauseCampaign(id: string): Promise<AdCampaign> {
    const campaign = await this.findCampaign(id);
    if (campaign.status !== CampaignStatus.ACTIVE) throw new BadRequestException('Only active campaigns can be paused');
    campaign.status = CampaignStatus.PAUSED;
    return this.campaignRepo.save(campaign);
  }

  async resumeCampaign(id: string): Promise<AdCampaign> {
    const campaign = await this.findCampaign(id);
    if (campaign.status !== CampaignStatus.PAUSED) throw new BadRequestException('Only paused campaigns can be resumed');
    campaign.status = CampaignStatus.ACTIVE;
    return this.campaignRepo.save(campaign);
  }

  async getCampaignsByAdvertiser(advertiserId: string): Promise<AdCampaign[]> {
    return this.campaignRepo.find({ where: { advertiserId }, order: { createdAt: 'DESC' } as any });
  }

  // ============ SPONSORSHIPS ============

  async createSponsorship(dto: CreateSponsorshipDto): Promise<SponsorshipRecord> {
    const sponsorship = new SponsorshipRecord();
    sponsorship.sponsorId = dto.sponsorId;
    sponsorship.sponsorName = dto.sponsorName;
    sponsorship.sponsorType = null;
    sponsorship.beneficiaryId = dto.beneficiaryId;
    sponsorship.beneficiaryName = dto.beneficiaryName;
    sponsorship.sponsorshipType = (dto.sponsorshipType || 'content') as any;
    sponsorship.status = SponsorshipStatus.PROPOSED;
    sponsorship.agreementValue = dto.agreementValue || 0;
    sponsorship.currency = dto.currency || 'USD';
    sponsorship.disclosureText = dto.disclosureText || null;
    sponsorship.isDisclosed = false;
    sponsorship.startDate = dto.startDate ? new Date(dto.startDate) : null;
    sponsorship.endDate = dto.endDate ? new Date(dto.endDate) : null;
    sponsorship.termsUrl = dto.termsUrl || null;
    sponsorship.campaignId = dto.campaignId || null;
    return this.sponsorshipRepo.save(sponsorship);
  }

  async findAllSponsorships(status?: string): Promise<SponsorshipRecord[]> {
    const where: any = {};
    if (status) where.status = status;
    return this.sponsorshipRepo.find({ where, order: { createdAt: 'DESC' } as any });
  }

  async findSponsorship(id: string): Promise<SponsorshipRecord> {
    const sponsorship = await this.sponsorshipRepo.findOne({ where: { id } });
    if (!sponsorship) throw new NotFoundException(`Sponsorship ${id} not found`);
    return sponsorship;
  }

  async discloseSponsorship(id: string): Promise<SponsorshipRecord> {
    const sponsorship = await this.findSponsorship(id);
    sponsorship.isDisclosed = true;
    sponsorship.disclosedAt = new Date();
    sponsorship.status = SponsorshipStatus.DISCLOSED;
    return this.sponsorshipRepo.save(sponsorship);
  }

  async activateSponsorship(id: string): Promise<SponsorshipRecord> {
    const sponsorship = await this.findSponsorship(id);
    if (!sponsorship.isDisclosed) throw new BadRequestException('Sponsorship must be disclosed before activation');
    sponsorship.status = SponsorshipStatus.ACTIVE;
    return this.sponsorshipRepo.save(sponsorship);
  }

  async endSponsorship(id: string): Promise<SponsorshipRecord> {
    const sponsorship = await this.findSponsorship(id);
    sponsorship.status = SponsorshipStatus.ENDED;
    return this.sponsorshipRepo.save(sponsorship);
  }

  async terminateSponsorship(id: string, reason: string): Promise<SponsorshipRecord> {
    const sponsorship = await this.findSponsorship(id);
    sponsorship.status = SponsorshipStatus.TERMINATED;
    sponsorship.metadata = `${sponsorship.metadata || ''}\nTerminated: ${reason}`.trim();
    return this.sponsorshipRepo.save(sponsorship);
  }

  async getSponsorshipsBySponsor(sponsorId: string): Promise<SponsorshipRecord[]> {
    return this.sponsorshipRepo.find({ where: { sponsorId }, order: { createdAt: 'DESC' } as any });
  }

  // ============ AD SPEND ============

  async createSpend(dto: CreateAdSpendDto): Promise<AdSpendRecord> {
    const campaign = await this.findCampaign(dto.campaignId);

    const spend = new AdSpendRecord();
    spend.campaignId = dto.campaignId;
    spend.spendDate = new Date(dto.spendDate);
    spend.amount = dto.amount;
    spend.currency = dto.currency || 'USD';
    spend.spendCategory = dto.spendCategory || null;
    spend.vendor = dto.vendor || null;
    spend.impressions = dto.impressions || 0;
    spend.clicks = dto.clicks || 0;
    spend.reach = dto.reach || 0;

    // Update campaign spent amount
    campaign.spentAmount = Number(campaign.spentAmount) + dto.amount;
    await this.campaignRepo.save(campaign);

    return this.spendRepo.save(spend);
  }

  async findSpendsByCampaign(campaignId: string): Promise<AdSpendRecord[]> {
    return this.spendRepo.find({ where: { campaignId }, order: { spendDate: 'DESC' } as any });
  }

  // ============ TRANSPARENCY REPORTS ============

  async getTransparencyReport(advertiserId?: string): Promise<any> {
    const campaignWhere: any = {};
    if (advertiserId) campaignWhere.advertiserId = advertiserId;

    const campaigns = await this.campaignRepo.find({ where: campaignWhere });
    const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.totalBudget), 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spentAmount), 0);

    const campaignIds = campaigns.map(c => c.id);
    let spends: AdSpendRecord[] = [];
    if (campaignIds.length > 0) {
      spends = await this.spendRepo
        .createQueryBuilder('s')
        .where('s.campaignId IN (:...ids)', { ids: campaignIds })
        .orderBy('s.spendDate', 'DESC')
        .getMany();
    }

    const sponsorshipWhere: any = {};
    if (advertiserId) sponsorshipWhere.sponsorId = advertiserId;
    const sponsorships = await this.sponsorshipRepo.find({ where: sponsorshipWhere });
    const disclosedCount = sponsorships.filter(s => s.isDisclosed).length;
    const totalSponsorshipValue = sponsorships.reduce((sum, s) => sum + Number(s.agreementValue), 0);

    const byType = campaigns.reduce((acc, c) => {
      const type = String(c.campaignType);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = campaigns.reduce((acc, c) => {
      const status = String(c.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      advertiserId: advertiserId || 'all',
      summary: {
        totalCampaigns: campaigns.length,
        totalBudget,
        totalSpent,
        budgetUtilization: totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(2) + '%' : '0%',
        totalSponsorships: sponsorships.length,
        disclosedSponsorships: disclosedCount,
        totalSponsorshipValue,
      },
      campaignsByType: byType,
      campaignsByStatus: byStatus,
      recentSpends: spends.slice(0, 10),
    };
  }

  async getStats(): Promise<any> {
    const totalCampaigns = await this.campaignRepo.count();
    const totalSponsorships = await this.sponsorshipRepo.count();
    const totalSpends = await this.spendRepo.count();

    const activeCampaigns = await this.campaignRepo.count({ where: { status: CampaignStatus.ACTIVE as any } });
    const politicalAds = await this.campaignRepo.count({ where: { isPolitical: true as any } });
    const disclosedSponsorships = await this.sponsorshipRepo.count({ where: { isDisclosed: true as any } });

    return {
      totalCampaigns,
      activeCampaigns,
      politicalAds,
      totalSponsorships,
      disclosedSponsorships,
      totalSpends,
    };
  }
}
