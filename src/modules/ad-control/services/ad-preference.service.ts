import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdPreference } from '../entities/ad-preference.entity';
import { CreateAdPreferenceDto } from '../dto/create-ad-preference.dto';
import { UpdateAdPreferenceDto } from '../dto/update-ad-preference.dto';
import { BulkUpdateAdPreferenceDto } from '../dto/bulk-update-ad-preference.dto';
import { DEFAULT_AD_CATEGORIES } from '../ad-control.constants';

@Injectable()
export class AdPreferenceService {
  constructor(
    @InjectRepository(AdPreference)
    private readonly repo: Repository<AdPreference>,
  ) {}

  findAll(userId?: string, adCategory?: string): Promise<AdPreference[]> {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (adCategory) where.adCategory = adCategory;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  findByUser(userId: string): Promise<AdPreference[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<AdPreference> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`AdPreference with id "${id}" not found`);
    return entity;
  }

  async create(dto: CreateAdPreferenceDto): Promise<AdPreference> {
    const existing = await this.repo.findOne({
      where: { userId: dto.userId, adCategory: dto.adCategory },
    });
    if (existing) {
      throw new BadRequestException(
        `AdPreference already exists for user "${dto.userId}" and category "${dto.adCategory}"`,
      );
    }
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAdPreferenceDto): Promise<AdPreference> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async bulkUpdate(dto: BulkUpdateAdPreferenceDto): Promise<AdPreference[]> {
    if (!dto.preferences || dto.preferences.length === 0) {
      throw new BadRequestException('Preferences array cannot be empty');
    }
    const results: AdPreference[] = [];
    for (const item of dto.preferences) {
      let entity = await this.repo.findOne({
        where: { userId: dto.userId, adCategory: item.adCategory },
      });
      if (entity) {
        Object.assign(entity, item);
        results.push(await this.repo.save(entity));
      } else {
        const created = this.repo.create({
          userId: dto.userId,
          ...item,
        });
        results.push(await this.repo.save(created));
      }
    }
    return results;
  }

  async resetToDefaults(userId: string): Promise<AdPreference[]> {
    await this.repo.softDelete({ userId });
    const results: AdPreference[] = [];
    for (const category of DEFAULT_AD_CATEGORIES) {
      const entity = this.repo.create({
        userId,
        adCategory: category,
        optIn: false,
        targetingAllowed: false,
        thirdPartySharingAllowed: false,
      });
      results.push(await this.repo.save(entity));
    }
    return results;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softDelete(entity.id);
  }
}
