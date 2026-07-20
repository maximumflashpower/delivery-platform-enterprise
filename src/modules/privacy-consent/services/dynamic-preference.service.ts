import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicPreference } from '../entities/dynamic-preference.entity';

@Injectable()
export class DynamicPreferenceService {
  constructor(
    @InjectRepository(DynamicPreference)
    private readonly repo: Repository<DynamicPreference>,
  ) {}

  async set(userId: string, key: string, value: string, scope?: string, category?: string): Promise<DynamicPreference> {
    const existing = await this.repo.findOne({
      where: { userId, preference_key: key, is_active: true }
    });

    if (existing) {
      existing.preference_value = value;
      existing.scope = scope || existing.scope;
      existing.category = category || existing.category;
      return this.repo.save(existing);
    }

    const preference = this.repo.create({
      userId,
      preference_key: key,
      preference_value: value,
      scope,
      category
    });

    return this.repo.save(preference);
  }

  async get(userId: string, key: string): Promise<string | null> {
    const pref = await this.repo.findOne({
      where: { userId, preference_key: key, is_active: true }
    });
    return pref ? pref.preference_value : null;
  }

  async getAll(userId: string, category?: string): Promise<DynamicPreference[]> {
    const query = this.repo.createQueryBuilder('p')
      .where('p.userId = :userId AND p.is_active = :isActive', { userId, isActive: true });

    if (category) {
      query.andWhere('p.category = :category', { category });
    }

    return query.orderBy('p.created_at', 'DESC').getMany();
  }

  async delete(userId: string, key: string): Promise<void> {
    const pref = await this.repo.findOne({ where: { userId, preference_key: key } });
    if (pref) {
      pref.is_active = false;
      await this.repo.save(pref);
    }
  }
}
