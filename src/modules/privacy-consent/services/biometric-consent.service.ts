import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiometricConsent } from '../entities/biometric-consent.entity';
import { GiveBiometricConsentDto, RevokeBiometricConsentDto } from '../dto/biometric-consent.dto';

@Injectable()
export class BiometricConsentService {
  private readonly logger = new Logger(BiometricConsentService.name);

  constructor(
    @InjectRepository(BiometricConsent)
    private readonly repo: Repository<BiometricConsent>,
  ) {}

  async giveConsent(dto: GiveBiometricConsentDto): Promise<BiometricConsent> {
    const existing = await this.repo.findOne({ 
      where: { 
        userId: dto.userId,
        biometricType: dto.biometricType,
        status: 'given'
      }
    });
    
    if (existing) {
      throw new BadRequestException(`Active consent already exists for user ${dto.userId}, type ${dto.biometricType}`);
    }
    
    const consent = new BiometricConsent();
    Object.assign(consent, dto);
    consent.status = 'given';
    consent.capturedAt = new Date();
    
    return this.repo.save(consent);
  }

  async revokeConsent(dto: RevokeBiometricConsentDto): Promise<BiometricConsent> {
    const consent = await this.repo.findOne({
      where: {
        userId: dto.userId,
        biometricType: dto.biometricType,
        status: 'given'
      }
    });
    
    if (!consent) {
      throw new NotFoundException(`No active consent found for user ${dto.userId}, type ${dto.biometricType}`);
    }
    
    consent.status = 'revoked';
    consent.updatedAt = new Date();
    
    const saved = await this.repo.save(consent);
    this.logger.log(`Biometric consent revoked for user ${dto.userId}, type ${dto.biometricType}`);
    return saved;
  }

  async hasValidConsent(userId: string, biometricType: string): Promise<boolean> {
    const consent = await this.repo.findOne({
      where: {
        userId,
        biometricType,
        status: 'given'
      }
    });
    return !!consent && (!consent.expiresAt || consent.expiresAt > new Date());
  }

  async findByUser(userId: string, biometricType?: string): Promise<BiometricConsent[]> {
    if (biometricType) {
      return this.repo.find({ where: { userId, biometricType }, order: { capturedAt: 'DESC' } });
    }
    return this.repo.find({ where: { userId }, order: { capturedAt: 'DESC' } });
  }

  async findById(id: string): Promise<BiometricConsent> {
    const consent = await this.repo.findOne({ where: { id } });
    if (!consent) throw new NotFoundException(`Consent ${id} not found`);
    return consent;
  }

  async getStats(): Promise<{
    totalConsents: number;
    activeConsents: number;
    revokedConsents: number;
    byType: Record<string, number>;
  }> {
    const totalConsents = await this.repo.count();
    const activeConsents = await this.repo.count({ where: { status: 'given' } });
    const revokedConsents = await this.repo.count({ where: { status: 'revoked' } });
    
    const allConsents = await this.repo.find();
    const byType: Record<string, number> = {};
    
    allConsents.forEach(c => {
      byType[c.biometricType] = (byType[c.biometricType] || 0) + 1;
    });
    
    return { totalConsents, activeConsents, revokedConsents, byType };
  }
}
