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

  async record(user_id: string, policy_id: string, version: string, action: ConsentAction, consentedBy?: string): Promise<PolicyConsent> {
    const consent = this.repo.create({
      user_id,
      policy_id,
      version,
      action,
      agreed_at: new Date(),
      consentedBy
    });
    return this.repo.save(consent);
  }

  async withdraw(user_id: string, policy_id: string, reason?: string): Promise<PolicyConsent> {
    const consent = await this.repo.findOne({
      where: { user_id, policy_id },
      order: { agreed_at: 'DESC' }
    });

    if (!consent) throw new NotFoundException(`Consent for policy ${policy_id} not found`);

    consent.action = ConsentAction.WITHDRAWN;
    consent.withdrawn_at = new Date();
    consent.withdrawal_reason = reason;

    return this.repo.save(consent);
  }

  async findByUser(user_id: string): Promise<PolicyConsent[]> {
    return this.repo.find({ where: { user_id }, order: { agreed_at: 'DESC' } });
  }

  async findByPolicy(policy_id: string): Promise<PolicyConsent[]> {
    return this.repo.find({ where: { policy_id }, order: { agreed_at: 'DESC' } });
  }

  async hasActiveConsent(user_id: string, policy_id: string): Promise<boolean> {
    const consent = await this.repo.findOne({
      where: { user_id, policy_id, action: ConsentAction.AGREED }
    });
    return !!consent;
  }

  async getLastConsentVersion(user_id: string, policy_id: string): Promise<string | null> {
    const consent = await this.repo.findOne({
      where: { user_id, policy_id },
      order: { agreed_at: 'DESC' }
    });
    return consent ? consent.version : null;
  }
}
