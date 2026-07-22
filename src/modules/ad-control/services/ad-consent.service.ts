import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdConsentRecord } from '../entities/ad-consent-record.entity';
import { CreateAdConsentRecordDto } from '../dto/create-ad-consent-record.dto';
import { UpdateAdConsentRecordDto } from '../dto/update-ad-consent-record.dto';

@Injectable()
export class AdConsentService {
  constructor(
    @InjectRepository(AdConsentRecord)
    private readonly repo: Repository<AdConsentRecord>,
  ) {}

  findAll(userId?: string, adCategory?: string, consentType?: string): Promise<AdConsentRecord[]> {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (adCategory) where.adCategory = adCategory;
    if (consentType) where.consentType = consentType;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  findByUser(userId: string): Promise<AdConsentRecord[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<AdConsentRecord> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`AdConsentRecord with id "${id}" not found`);
    return entity;
  }

  async create(dto: CreateAdConsentRecordDto): Promise<AdConsentRecord> {
    const entity = this.repo.create({
      ...dto,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAdConsentRecordDto): Promise<AdConsentRecord> {
    const entity = await this.findOne(id);
    const { validUntil, ...rest } = dto;
    Object.assign(entity, rest);
    if (validUntil !== undefined) {
      entity.validUntil = validUntil ? new Date(validUntil) : null;
    }
    return this.repo.save(entity);
  }

  async revoke(id: string): Promise<AdConsentRecord> {
    const entity = await this.findOne(id);
    entity.consentValue = false;
    entity.revokedAt = new Date();
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softDelete(entity.id);
  }
}
