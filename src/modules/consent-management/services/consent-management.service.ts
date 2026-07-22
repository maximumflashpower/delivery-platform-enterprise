import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Consent } from '../entities/consent.entity';
import { UserPreference } from '../entities/user-preference.entity';
import { NotificationPreference } from '../entities/notification-preference.entity';
import { ConsentHistory } from '../entities/consent-history.entity';
import {
  GrantConsentDto,
  RevokeConsentDto,
  SetUserPreferenceDto,
  BulkPreferenceUpdateDto,
  SetNotificationPreferenceDto,
  ListConsentsQueryDto,
} from '../dto/consent-management.dto';

@Injectable()
export class ConsentManagementService {
  private readonly logger = new Logger(ConsentManagementService.name);

  constructor(
    @InjectRepository(Consent)
    private readonly consentRepo: Repository<Consent>,
    @InjectRepository(UserPreference)
    private readonly preferenceRepo: Repository<UserPreference>,
    @InjectRepository(NotificationPreference)
    private readonly notificationPrefRepo: Repository<NotificationPreference>,
    @InjectRepository(ConsentHistory)
    private readonly historyRepo: Repository<ConsentHistory>,
  ) {}

  async grantConsent(userId: string, dto: GrantConsentDto): Promise<Consent> {
    const existing = await this.consentRepo.findOne({
      where: { userId, purpose: dto.purpose, status: 'granted' },
      order: { createdAt: 'DESC' },
    });

    if (existing && (!dto.version || !existing.version || dto.version === existing.version)) {
      this.logger.warn(`Consent already granted for user ${userId} purpose ${dto.purpose}`);
      existing.updatedAt = new Date();
      if (dto.metadata) existing.metadata = dto.metadata;
      return this.consentRepo.save(existing);
    }

    const consent = new Consent();
    consent.userId = userId;
    consent.purpose = dto.purpose;
    consent.status = 'granted';
    consent.method = 'web_form';
    consent.version = (dto.version ?? '') as any;
    consent.documentUrl = (dto.documentUrl ?? '') as any;
    consent.ipAddress = (dto.ipAddress ?? '') as any;
    consent.metadata = dto.metadata ?? null;
    consent.grantedAt = new Date();
    consent.revokedAt = null as any;
    consent.expiresAt = null as any;
    consent.parentConsentId = (existing?.id ?? '') as any;

    const saved = await this.consentRepo.save(consent);
    
    const history = new ConsentHistory();
    history.consentId = saved.id;
    history.userId = saved.userId;
    history.purpose = saved.purpose;
    history.previousStatus = 'created';
    history.newStatus = 'granted';
    history.action = 'grant';
    history.method = saved.method;
    history.reason = '';
    history.ipAddress = dto.ipAddress ?? '';
    history.metadata = dto.metadata ?? null;
    history.performedBy = '';
    await this.historyRepo.save(history);
    
    this.logger.log(`Consent granted: ${saved.id} for user ${userId} purpose ${dto.purpose}`);
    return saved;
  }

  async revokeConsent(userId: string, consentId: string, dto?: RevokeConsentDto): Promise<Consent> {
    const consent = await this.consentRepo.findOne({ where: { id: consentId, userId } });
    if (!consent) throw new NotFoundException(`Consent ${consentId} not found for user ${userId}`);
    if (consent.status !== 'granted') {
      throw new BadRequestException(`Consent is not granted (current status: ${consent.status})`);
    }

    const previousStatus = consent.status;
    consent.status = 'revoked';
    consent.revokedAt = new Date();

    const saved = await this.consentRepo.save(consent);
    
    const history = new ConsentHistory();
    history.consentId = saved.id;
    history.userId = saved.userId;
    history.purpose = saved.purpose;
    history.previousStatus = previousStatus;
    history.newStatus = 'revoked';
    history.action = 'revoke';
    history.method = saved.method;
    history.reason = dto?.reason ?? '';
    history.ipAddress = consent.ipAddress ?? '';
    history.metadata = dto?.metadata ?? null;
    history.performedBy = '';
    await this.historyRepo.save(history);
    
    this.logger.log(`Consent revoked: ${saved.id} for user ${userId}`);
    return saved;
  }

  async findAllConsents(userId: string, query?: ListConsentsQueryDto): Promise<{ items: Consent[]; total: number }> {
    const limit = Math.min(parseInt(query?.limit ?? '50', 10), 200);
    const offset = parseInt(query?.offset ?? '0', 10);

    const findOptions: FindManyOptions<Consent> = {
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
      where: { userId },
    };

    if (query?.purpose) {
      (findOptions.where as any).purpose = query.purpose;
    }
    if (query?.status) {
      (findOptions.where as any).status = query.status;
    }

    const [items, total] = await this.consentRepo.findAndCount(findOptions);
    return { items, total };
  }

  async findConsentById(userId: string, consentId: string): Promise<Consent> {
    const consent = await this.consentRepo.findOne({ where: { id: consentId, userId } });
    if (!consent) throw new NotFoundException(`Consent ${consentId} not found for user ${userId}`);
    return consent;
  }

  async findActiveConsents(userId: string): Promise<Consent[]> {
    return this.consentRepo.find({
      where: { userId, status: 'granted' },
      order: { grantedAt: 'ASC' },
    });
  }

  async getConsentHistory(consentId: string): Promise<ConsentHistory[]> {
    return this.historyRepo.find({
      where: { consentId },
      order: { timestamp: 'DESC' },
    });
  }

  async setUserPreference(userId: string, dto: SetUserPreferenceDto): Promise<UserPreference> {
    const existing = await this.preferenceRepo.findOne({
      where: { userId, category: dto.category, key: dto.key },
    });

    if (existing) {
      existing.value = (dto.value ?? '') as any;
      existing.jsonValue = dto.jsonValue ?? null;
      existing.source = dto.source ?? 'user';
      return this.preferenceRepo.save(existing);
    }

    const preference = new UserPreference();
    preference.userId = userId;
    preference.category = dto.category;
    preference.key = dto.key;
    preference.value = (dto.value ?? '') as any;
    preference.jsonValue = dto.jsonValue ?? null;
    preference.source = dto.source ?? 'user';
    preference.defaultValue = '' as any;

    const saved = await this.preferenceRepo.save(preference);
    this.logger.log(`Preference set: ${saved.id} for user ${userId} ${dto.category}.${dto.key}`);
    return saved;
  }

  async bulkSetPreferences(userId: string, dto: BulkPreferenceUpdateDto): Promise<UserPreference[]> {
    const results: UserPreference[] = [];
    for (const pref of dto.preferences) {
      const result = await this.setUserPreference(userId, pref);
      results.push(result);
    }
    return results;
  }

  async getUserPreferences(userId: string, category?: string): Promise<UserPreference[]> {
    const findOptions: FindManyOptions<UserPreference> = {
      where: { userId },
      order: { createdAt: 'DESC' },
    };

    if (category) {
      (findOptions.where as any).category = category;
    }

    return this.preferenceRepo.find(findOptions);
  }

  async getPreference(userId: string, category: string, key: string): Promise<UserPreference> {
    const pref = await this.preferenceRepo.findOne({
      where: { userId, category, key },
    });

    if (!pref) {
      const defaultPref = new UserPreference();
      defaultPref.userId = userId;
      defaultPref.category = category;
      defaultPref.key = key;
      defaultPref.value = '' as any;
      defaultPref.jsonValue = null;
      defaultPref.source = 'system';
      defaultPref.defaultValue = '' as any;
      return defaultPref;
    }

    return pref;
  }

  async deleteUserPreference(userId: string, category: string, key: string): Promise<void> {
    const result = await this.preferenceRepo.delete({ userId, category, key });
    if (result.affected === 0) {
      throw new NotFoundException(`Preference ${category}.${key} not found for user ${userId}`);
    }
  }

  async setNotificationPreference(userId: string, dto: SetNotificationPreferenceDto): Promise<NotificationPreference> {
    const existing = await this.notificationPrefRepo.findOne({
      where: { userId, channel: dto.channel, communicationType: dto.communicationType },
    });

    if (existing) {
      existing.enabled = dto.enabled;
      existing.recipient = (dto.recipient ?? '') as any;
      existing.frequency = (dto.frequency ?? '') as any;
      existing.quietStartTime = dto.quietStartTime ? new Date(dto.quietStartTime) : null as any;
      existing.quietEndTime = dto.quietEndTime ? new Date(dto.quietEndTime) : null as any;
      existing.settings = dto.settings ?? null;
      return this.notificationPrefRepo.save(existing);
    }

    const pref = new NotificationPreference();
    pref.userId = userId;
    pref.channel = dto.channel;
    pref.communicationType = dto.communicationType;
    pref.enabled = dto.enabled;
    pref.recipient = (dto.recipient ?? '') as any;
    pref.frequency = (dto.frequency ?? '') as any;
    pref.quietStartTime = dto.quietStartTime ? new Date(dto.quietStartTime) : null as any;
    pref.quietEndTime = dto.quietEndTime ? new Date(dto.quietEndTime) : null as any;
    pref.settings = dto.settings ?? null;

    const saved = await this.notificationPrefRepo.save(pref);
    this.logger.log(`Notification preference set: ${saved.id} for user ${userId} ${dto.channel}/${dto.communicationType}`);
    return saved;
  }

  async getNotificationPreferences(userId: string, channel?: string): Promise<NotificationPreference[]> {
    const findOptions: FindManyOptions<NotificationPreference> = {
      where: { userId },
      order: { channel: 'ASC', communicationType: 'ASC' },
    };

    if (channel) {
      (findOptions.where as any).channel = channel;
    }

    return this.notificationPrefRepo.find(findOptions);
  }

  async getNotificationPreference(userId: string, channel: string, communicationType: string): Promise<NotificationPreference | null> {
    return this.notificationPrefRepo.findOne({
      where: { userId, channel, communicationType },
    });
  }

  async canSendNotification(userId: string, channel: string, communicationType: string): Promise<{
    allowed: boolean;
    reason: string | null;
  }> {
    const pref = await this.getNotificationPreference(userId, channel, communicationType);

    if (!pref) {
      return { allowed: true, reason: null };
    }

    if (!pref.enabled) {
      return { allowed: false, reason: `Notifications disabled for ${channel}/${communicationType}` };
    }

    return { allowed: true, reason: null };
  }

  async getStats(): Promise<{
    totalConsents: number;
    grantedConsents: number;
    revokedConsents: number;
    totalUsersWithConsents: number;
    totalPreferences: number;
    totalNotificationPreferences: number;
  }> {
    const totalConsents = await this.consentRepo.count();
    const grantedConsents = await this.consentRepo.count({ where: { status: 'granted' } });
    const revokedConsents = await this.consentRepo.count({ where: { status: 'revoked' } });

    const consents = await this.consentRepo.find({ select: ['userId'] });
    const uniqueUsers = new Set(consents.map(c => c.userId));

    const totalPreferences = await this.preferenceRepo.count();
    const totalNotificationPreferences = await this.notificationPrefRepo.count();

    return {
      totalConsents,
      grantedConsents,
      revokedConsents,
      totalUsersWithConsents: uniqueUsers.size,
      totalPreferences,
      totalNotificationPreferences,
    };
  }
}
