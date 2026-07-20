import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacyConsent, ConsentType, ConsentStatus } from '../entities/privacy-consent.entity';

@Injectable()
export class PrivacyConsentService {
  constructor(
    @InjectRepository(PrivacyConsent)
    private readonly repo: Repository<PrivacyConsent>,
  ) {}

  async grant(userId: string, type: ConsentType, purpose?: string, version?: string): Promise<PrivacyConsent> {
    const existing = await this.repo.findOne({
      where: { userId, consent_type: type, is_active: true }
    });

    if (existing && existing.status === ConsentStatus.GRANTED) {
      existing.granted_at = new Date();
      existing.version = version || existing.version;
      return this.repo.save(existing);
    }

    const consent = this.repo.create({
      userId,
      consent_type: type,
      status: ConsentStatus.GRANTED,
      purpose_description: purpose,
      version,
      granted_at: new Date(),
      is_active: true
    });

    return this.repo.save(consent);
  }

  async withdraw(userId: string, consentId: string, reason?: string): Promise<PrivacyConsent> {
    const consent = await this.repo.findOne({ where: { id: consentId, userId } });
    if (!consent) throw new NotFoundException(`Consent ${consentId} not found`);

    consent.status = ConsentStatus.WITHDRAWN;
    consent.withdrawn_at = new Date();
    consent.withdrawal_reason = reason ?? null;
    consent.is_active = false;

    return this.repo.save(consent);
  }

  async findByUser(userId: string): Promise<PrivacyConsent[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<PrivacyConsent> {
    const consent = await this.repo.findOne({ where: { id, userId } });
    if (!consent) throw new NotFoundException(`Consent ${id} not found`);
    return consent;
  }

  async getActiveConsents(userId: string, type?: ConsentType): Promise<PrivacyConsent[]> {
    const query = this.repo.createQueryBuilder('c')
      .where('c.userId = :userId AND c.is_active = :isActive', { userId, isActive: true });

    if (type) {
      query.andWhere('c.consent_type = :type', { type });
    }

    return query.getMany();
  }

  async checkConsent(userId: string, type: ConsentType): Promise<boolean> {
    const consent = await this.repo.findOne({
      where: { userId, consent_type: type, status: ConsentStatus.GRANTED, is_active: true }
    });
    return !!consent;
  }
}
