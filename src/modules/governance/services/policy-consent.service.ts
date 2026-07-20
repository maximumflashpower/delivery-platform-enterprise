import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyConsent, ConsentAction } from '../entities/policy-consent.entity';

@Injectable()
export class PolicyConsentService {
  constructor(
    @InjectRepository(PolicyConsent)
    private readonly repo: Repository<PolicyConsent>,
  ) {}

  async record(userId: string, policyId: string, version: string, action: ConsentAction, consentedBy?: string): Promise<PolicyConsent> {
    const consent = this.repo.create({
      userId,
      policyId,
      version,
      action,
      agreed_at: new Date(),
      consentedBy: consentedBy || null
    });
    return this.repo.save(consent);
  }

  async withdraw(userId: string, policyId: string, reason?: string): Promise<PolicyConsent> {
    const consent = await this.repo.findOne({
      where: { userId, policyId },
      order: { agreed_at: 'DESC' }
    });

    if (!consent) throw new NotFoundException(`Consent for policy ${policyId} not found`);

    consent.action = ConsentAction.WITHDRAWN;
    consent.withdrawn_at = new Date();
    consent.withdrawal_reason = reason || null;

    return this.repo.save(consent);
  }

  async findByUser(userId: string): Promise<PolicyConsent[]> {
    return this.repo.find({ where: { userId }, order: { agreed_at: 'DESC' } });
  }

  async findByPolicy(policyId: string): Promise<PolicyConsent[]> {
    return this.repo.find({ where: { policyId }, order: { agreed_at: 'DESC' } });
  }

  async hasActiveConsent(userId: string, policyId: string): Promise<boolean> {
    const consent = await this.repo.findOne({
      where: { userId, policyId, action: ConsentAction.AGREED }
    });
    return !!consent;
  }

  async getLastConsentVersion(userId: string, policyId: string): Promise<string | null> {
    const consent = await this.repo.findOne({
      where: { userId, policyId },
      order: { agreed_at: 'DESC' }
    });
    return consent ? consent.version : null;
  }
}
